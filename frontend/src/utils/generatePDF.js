import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * ENTERPRISE PDF REPORT GENERATOR
 *
 * @param {Array} candidates
 * @param {Object} options
 * @param {string} options.jobDescription
 * @param {string} options.recruiterName
 * @param {string} options.companyName
 * @param {string|null} options.logoUrl  // e.g. "/logo.png"
 */
export const generatePDF = async (
  candidates,
  {
    jobDescription = "",
    recruiterName = "Recruiter",
    companyName = "HireSense",
    logoUrl = null,
  } = {}
) => {
  if (!candidates || candidates.length === 0) {
    alert("No candidates available to export.");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const generatedAt = new Date().toLocaleString();

  const ranked = [...candidates].sort(
    (a, b) => Number(b.final_score) - Number(a.final_score)
  );

  const topCandidate = ranked[0];

  const avgScore = (
    ranked.reduce((sum, c) => sum + Number(c.final_score || 0), 0) / ranked.length
  ).toFixed(1);

  const shortlistCount = ranked.filter((c) => Number(c.final_score) >= 75).length;
  const reviewCount = ranked.filter(
    (c) => Number(c.final_score) >= 55 && Number(c.final_score) < 75
  ).length;
  const rejectCount = ranked.filter((c) => Number(c.final_score) < 55).length;

  const allMatchedSkills = {};
  const allMissingSkills = {};

  ranked.forEach((candidate) => {
    (candidate.matched_skills || []).forEach((skill) => {
      allMatchedSkills[skill] = (allMatchedSkills[skill] || 0) + 1;
    });

    (candidate.missing_skills || []).forEach((skill) => {
      allMissingSkills[skill] = (allMissingSkills[skill] || 0) + 1;
    });
  });

  const topSkills = Object.entries(allMatchedSkills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([skill]) => skill);

  const topMissing = Object.entries(allMissingSkills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([skill]) => skill);

  // ---------- Helper Functions ----------
  const scoreStatus = (score) => {
    const s = Number(score);
    if (s >= 75) return "Shortlist";
    if (s >= 55) return "Review";
    return "Reject";
  };

  const statusColor = (status) => {
    if (status === "Shortlist") return [34, 139, 34];
    if (status === "Review") return [230, 160, 0];
    return [180, 60, 60];
  };

  const drawHeader = (title, subtitle = "") => {
    doc.setFillColor(34, 34, 59); // #22223B
    doc.rect(0, 0, pageWidth, 24, "F");

    doc.setTextColor(242, 233, 228); // #F2E9E4
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text(title, margin, 11);

    if (subtitle) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(subtitle, margin, 18);
    }

    doc.setTextColor(30, 30, 30);
  };

  const drawFooter = (pageNum) => {
    doc.setDrawColor(210, 210, 210);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text(`${companyName} • Confidential Hiring Report`, margin, pageHeight - 6);
    doc.text(`Page ${pageNum}`, pageWidth - margin - 15, pageHeight - 6);
    doc.setTextColor(30, 30, 30);
  };

  const ensurePage = (currentY, requiredHeight = 40, title = "Candidate Analysis") => {
    if (currentY + requiredHeight > pageHeight - 18) {
      drawFooter(doc.getNumberOfPages());
      doc.addPage();
      drawHeader(title, `Generated on ${generatedAt}`);
      return 34;
    }
    return currentY;
  };

  const sectionHeading = (text, y) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(74, 78, 105);
    doc.text(text, margin, y);
    doc.setDrawColor(201, 173, 167);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    doc.setTextColor(30, 30, 30);
    return y + 10;
  };

  const wrappedText = (label, value, y, fontSize = 10.5) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    doc.text(`${label}:`, margin, y);

    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(value || "N/A", contentWidth);
    doc.text(lines, margin, y + 5.5);
    return y + lines.length * 5.5 + 8;
  };

  const drawInfoCard = (x, y, w, h, title, value, subtitle = "") => {
    doc.setFillColor(248, 247, 246);
    doc.roundedRect(x, y, w, h, 3, 3, "F");
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(x, y, w, h, 3, 3);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(title, x + 5, y + 8);

    doc.setFont("helvetica", "bold");
    const strVal = String(value);
    let valSize = 18;
    if (strVal.length > 8) valSize = 13;
    if (strVal.length > 14) valSize = 10;
    
    doc.setFontSize(valSize);
    doc.setTextColor(34, 34, 59);
    doc.text(strVal, x + 5, y + 18);

    if (subtitle) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(120, 120, 120);
      doc.text(subtitle, x + 5, y + 25);
    }

    doc.setTextColor(30, 30, 30);
  };

  const drawBadge = (x, y, text, status) => {
    const [r, g, b] = statusColor(status);
    doc.setFillColor(r, g, b);
    doc.roundedRect(x, y, 28, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(text, x + 4, y + 5.3);
    doc.setTextColor(30, 30, 30);
  };

  const addChart = async (elementId, title, y) => {
    const el = document.getElementById(elementId);
    if (!el) return y;

    y = ensurePage(y, 100, "Visual Insights");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(74, 78, 105);
    doc.text(title, margin, y);
    doc.setTextColor(30, 30, 30);
    y += 6;

    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addImage(imgData, "PNG", margin, y, imgWidth, imgHeight);
    return y + imgHeight + 10;
  };

  const loadImageAsDataURL = (url) =>
    new Promise((resolve) => {
      if (!url) return resolve(null);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });

  // ---------- PAGE 1: COVER ----------
  doc.setFillColor(34, 34, 59);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFillColor(212, 163, 115); // Warm tan top band
  doc.rect(0, 0, pageWidth, 5, "F");

  // Custom Text Logo replacing the image
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(242, 233, 228); 
  doc.text("Hire", margin, 30);
  doc.setTextColor(212, 163, 115); // Tan
  doc.text("Sense", margin + 19.5, 30);
  
  // Fancy 'AI' Badge next to it
  doc.setDrawColor(212, 163, 115);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin + 52.5, 23.5, 7, 6, 1, 1);
  doc.setFontSize(8);
  doc.text("AI", margin + 53.5, 28);

  doc.setTextColor(242, 233, 228);
  doc.setFontSize(26);
  doc.text("Candidate Screening Report", margin, 58);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`${companyName} • Enterprise Hiring Intelligence`, margin, 67);

  doc.setDrawColor(242, 233, 228);
  doc.line(margin, 75, pageWidth - margin, 75);

  doc.setFontSize(10.5);
  doc.text(`Prepared for: ${recruiterName}`, margin, 86);
  doc.text(`Generated on: ${generatedAt}`, margin, 93);
  doc.text(`Total Candidates: ${ranked.length}`, margin, 100);
  doc.text(`Average Score: ${avgScore}%`, margin, 107);

  // Top candidate hero box
  doc.setFillColor(74, 78, 105);
  doc.roundedRect(margin, 120, contentWidth, 34, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Top Recommended Candidate", margin + 6, 131);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Filename: ${topCandidate.filename}`, margin + 6, 140);
  doc.text(`Final Score: ${topCandidate.final_score}%`, margin + 6, 147);

  // Executive summary box
  doc.setFillColor(242, 233, 228);
  doc.roundedRect(margin, 165, contentWidth, 68, 4, 4, "F");

  doc.setTextColor(34, 34, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Executive Summary", margin + 6, 176);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);

  const execSummary = doc.splitTextToSize(
    `This report presents AI-assisted evaluation results for ${ranked.length} candidate(s) screened against the target role. `
      + `The ranking is based on semantic similarity, technical skill alignment, and explanation-driven suitability assessment. `
      + `The strongest candidate identified in this batch is ${topCandidate.filename} with a score of ${topCandidate.final_score}%. `
      + `Common strengths observed across the pool include: ${topSkills.join(", ") || "N/A"}. `
      + `Most recurring skill gaps include: ${topMissing.join(", ") || "N/A"}.`,
    contentWidth - 12
  );
  doc.text(execSummary, margin + 6, 184);

  // Optional JD snippet
  if (jobDescription) {
    doc.setFillColor(154, 140, 152);
    doc.roundedRect(margin, 242, contentWidth, 34, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Role Snapshot", margin + 6, 251);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const jdLines = doc.splitTextToSize(jobDescription, contentWidth - 12).slice(0, 4);
    doc.text(jdLines, margin + 6, 258);
  }

  drawFooter(1);

  // ---------- PAGE 2: SUMMARY DASHBOARD ----------
  doc.addPage();
  drawHeader("Hiring Summary Dashboard", `Generated on ${generatedAt}`);
  let y = 34;

  y = sectionHeading("Overview Metrics", y);

  const cardWidth = (contentWidth - 10) / 3;
  drawInfoCard(margin, y, cardWidth, 32, "Total Candidates", ranked.length);
  drawInfoCard(margin + cardWidth + 5, y, cardWidth, 32, "Average Score", `${avgScore}%`);
  drawInfoCard(
    margin + (cardWidth + 5) * 2,
    y,
    cardWidth,
    32,
    "Top Candidate",
    topCandidate.filename.length > 16
      ? topCandidate.filename.slice(0, 16) + "..."
      : topCandidate.filename,
    `${topCandidate.final_score}%`
  );

  y += 42;

  drawInfoCard(margin, y, cardWidth, 32, "Shortlist", shortlistCount, "75% and above");
  drawInfoCard(margin + cardWidth + 5, y, cardWidth, 32, "Review", reviewCount, "55% to 74%");
  drawInfoCard(margin + (cardWidth + 5) * 2, y, cardWidth, 32, "Reject", rejectCount, "Below 55%");

  y += 46;
  y = sectionHeading("Top Skills Snapshot", y);

  y = wrappedText("Most Common Matching Skills", topSkills.join(", ") || "N/A", y);
  y = wrappedText("Most Common Missing Skills", topMissing.join(", ") || "N/A", y);

  y += 4;
  y = sectionHeading("Candidate Ranking Table", y);

  // Table Header
  doc.setFillColor(34, 34, 59);
  doc.rect(margin, y, contentWidth, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("Rank", margin + 3, y + 6.5);
  doc.text("Candidate", margin + 18, y + 6.5);
  doc.text("Score", margin + 110, y + 6.5);
  doc.text("Status", margin + 140, y + 6.5);

  doc.setTextColor(30, 30, 30);
  y += 12;

  ranked.forEach((candidate, index) => {
    y = ensurePage(y, 12, "Hiring Summary Dashboard");

    doc.setFillColor(index % 2 === 0 ? 248 : 255, index % 2 === 0 ? 248 : 255, index % 2 === 0 ? 248 : 255);
    doc.rect(margin, y - 1, contentWidth, 10, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(String(index + 1), margin + 3, y + 5);
    doc.text(
      candidate.filename.length > 28
        ? candidate.filename.slice(0, 28) + "..."
        : candidate.filename,
      margin + 18,
      y + 5
    );
    doc.text(`${candidate.final_score}%`, margin + 110, y + 5);

    const status = scoreStatus(candidate.final_score);
    drawBadge(margin + 138, y + 0.5, status, status);

    y += 11;
  });

  drawFooter(doc.getNumberOfPages());

  // ---------- PAGE 3+: DETAILED CANDIDATE PAGES ----------
  doc.addPage();
  drawHeader("Candidate Evaluation Details", `Generated on ${generatedAt}`);
  y = 34;

  ranked.forEach((candidate, index) => {
    y = ensurePage(y, 80, "Candidate Evaluation Details");

    const status = scoreStatus(candidate.final_score);

    // Candidate title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(34, 34, 59);
    doc.text(`${index + 1}. ${candidate.filename}`, margin, y);
    drawBadge(pageWidth - margin - 32, y - 4, status, status);
    y += 8;

    // Score summary bar
    doc.setFillColor(248, 247, 246);
    doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(74, 78, 105);
    doc.text(`Final Score: ${candidate.final_score}%`, margin + 4, y + 7);
    doc.text(`Skill Match: ${candidate.skill_match_score ?? "N/A"}%`, margin + 55, y + 7);
    doc.text(`Semantic Score: ${candidate.semantic_score ?? "N/A"}%`, margin + 115, y + 7);

    doc.setTextColor(30, 30, 30);
    y += 25;

    y = wrappedText(
      "Matched Skills",
      (candidate.matched_skills || []).join(", ") || "None identified",
      y
    );

    y = wrappedText(
      "Missing Skills",
      (candidate.missing_skills || []).join(", ") || "No major gaps identified",
      y
    );

    y = wrappedText(
      "AI Evaluation Summary",
      candidate.explanation || "No explanation available.",
      y
    );

    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
  });

  drawFooter(doc.getNumberOfPages());

  // ---------- CHARTS PAGE ----------
  doc.addPage();
  drawHeader("Visual Hiring Insights", `Generated on ${generatedAt}`);
  y = 34;

  y = sectionHeading("Analytics & Charts", y);

  // IMPORTANT: these IDs must exist in your UI
  // skills-analytics-section
  // score-chart-section
  y = await addChart("skills-analytics-section", "Top Skills & Missing Skills", y);
  y = await addChart("score-chart-section", "Candidate Score Comparison", y);

  drawFooter(doc.getNumberOfPages());

  // ---------- SAVE ----------
  doc.save("enterprise-hiring-report.pdf");
};