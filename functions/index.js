const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();
const db = admin.firestore();

// ─── 1. analyzeReport ────────────────────────────────────────────────────────
// Triggered when a new report is created in Firestore.
// Calls Gemini AI to extract structured fields + assign priority,
// then runs volunteer matching — mirroring report_pipeline.py + match.py
exports.analyzeReport = functions.firestore
  .document("reports/{reportId}")
  .onCreate(async (snap, context) => {
    const report = snap.data();
    const description = report.description || "";
    const category = report.category || "Others";
    const location = report.location || "";

    const geminiKey = functions.config().gemini?.key;

    let priority = "Medium";
    let aiAnalyzed = false;

    // ── Gemini AI analysis (mirrors analyze_report() in report_pipeline.py) ──
    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
You are an emergency report classifier.
Given this report description, return ONLY a JSON object with two fields:
- "priority": one of "Low", "Medium", "High", "Critical"
- "issue": a short 3-5 word summary of the core problem

Description: ${description}
Category: ${category}

Return ONLY valid JSON. No markdown, no extra text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(text);

        priority = parsed.priority || "Medium";
        aiAnalyzed = true;

        // Update report with AI results
        await snap.ref.update({
          priority,
          issue: parsed.issue || "",
          aiAnalyzed: true,
          aiAnalysisDate: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.error("Gemini AI error:", err.message);
        // Fall through to keyword fallback below
      }
    }

    // ── Keyword fallback (used if no Gemini key or AI fails) ──
    if (!aiAnalyzed) {
      const d = description.toLowerCase();
      if (["death", "bleeding", "heart attack", "critical", "drowning"].some(w => d.includes(w))) {
        priority = "Critical";
      } else if (["urgent", "accident", "fire", "collapse"].some(w => d.includes(w))) {
        priority = "High";
      } else if (["food", "water", "shelter", "flood"].some(w => d.includes(w))) {
        priority = "Medium";
      } else {
        priority = "Low";
      }

      await snap.ref.update({
        priority,
        aiAnalyzed: false,
        aiAnalysisDate: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // ── Volunteer matching (mirrors run_matching_pipeline() in match.py) ──
    try {
      const volunteersSnap = await db.collection("users")
        .where("role", "==", "volunteer")
        .where("approved", "==", true)
        .get();

      const normalizedCategory = category.trim().toLowerCase();
      const normalizedLocation = location.trim().toLowerCase();
      const normalizedDesc = description.toLowerCase();

      const matches = [];

      volunteersSnap.forEach(vDoc => {
        const v = vDoc.data();

        // Category match — mandatory (check skills array or category field)
        const volunteerCategories = (v.categories || [v.category] || [])
          .map(c => c?.toLowerCase());
        if (!volunteerCategories.includes(normalizedCategory)) return;

        let count = 0;

        // Location match
        if ((v.city || "").toLowerCase() === normalizedLocation) count += 1;

        // Skills match
        (v.skills || []).forEach(skill => {
          if (normalizedDesc.includes(skill.toLowerCase())) count += 1;
        });

        // Profession match
        if (v.profession && normalizedDesc.includes(v.profession.toLowerCase())) count += 1;

        // Availability
        if ((v.availability || "").toLowerCase() === "available") count += 1;

        matches.push({
          volunteerUid: vDoc.id,
          name: v.fullName || v.name || "",
          contact: v.phone || v.contact || "",
          matchScore: Math.min(50 + count * 12, 99),
        });
      });

      matches.sort((a, b) => b.matchScore - a.matchScore);
      const top3 = matches.slice(0, 3);

      // Store matches in Firestore (mirrors match.py store logic)
      await db.collection("matches").add({
        reportId: context.params.reportId,
        report: { description, category, location, priority },
        matchedVolunteers: top3,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Also update the report with suggested volunteers
      await snap.ref.update({ suggestedVolunteers: top3 });

    } catch (err) {
      console.error("Matching error:", err.message);
    }

    return null;
  });


// ─── 2. onTaskComplete ───────────────────────────────────────────────────────
// Triggered when a task is updated to "Completed".
// Updates the linked report status to Completed.
exports.onTaskComplete = functions.firestore
  .document("tasks/{taskId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (after.status === "Completed" && before.status !== "Completed") {
      if (after.reportId) {
        await db.collection("reports").doc(after.reportId).update({
          status: "Completed",
        });
      }
      console.log(`Task ${context.params.taskId} completed.`);
    }

    return null;
  });
