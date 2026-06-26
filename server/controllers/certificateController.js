const PDFDocument = require("pdfkit");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const User = require("../models/user");

// GET /api/certificate/:registrationId
const generateCertificate = async (req, res) => {
    try {
        const { registrationId } = req.params;
        const userId = req.user.id || req.user._id;

        // Find registration and populate event and user
        const registration = await Registration.findById(registrationId)
            .populate({
                path: "eventId",
                populate: {
                    path: "createdBy",
                    select: "name email",
                },
            })
            .populate("userID", "name email");

        // Validate registration exists
        if (!registration) {
            return res.status(404).json({ message: "Registration not found." });
        }

        // Only the registered student can download their own certificate
        if (registration.userID._id.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized. This is not your certificate." });
        }

        // Only allow download if attendance is marked true
        if (!registration.attended) {
            return res.status(403).json({
                message: "Certificate not available. Attendance has not been marked yet.",
            });
        }

        const studentName = registration.userID.name;
        const eventName = registration.eventId.title;
        const eventDate = new Date(registration.eventId.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        const organizerName = registration.eventId.createdBy?.name || "EventSphere";

        // Create PDF
        const doc = new PDFDocument({
            size: "A4",
            layout: "landscape",
            margins: { top: 40, bottom: 40, left: 40, right: 40 },
        });

        // Set response headers so browser downloads the file
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="certificate-${studentName.replace(/\s+/g, "-")}.pdf"`
        );

        // Pipe PDF into response
        doc.pipe(res);

        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        // ── Background ──────────────────────────────────────────
        doc.rect(0, 0, pageWidth, pageHeight).fill("#0f172a");

        // ── Outer decorative border ──────────────────────────────
        doc
            .rect(20, 20, pageWidth - 40, pageHeight - 40)
            .lineWidth(2)
            .stroke("#6366f1");

        // ── Inner border ─────────────────────────────────────────
        doc
            .rect(28, 28, pageWidth - 56, pageHeight - 56)
            .lineWidth(0.5)
            .stroke("#4f46e5");

        // ── Top accent bar ────────────────────────────────────────
        doc.rect(20, 20, pageWidth - 40, 6).fill("#6366f1");

        // ── Bottom accent bar ─────────────────────────────────────
        doc.rect(20, pageHeight - 26, pageWidth - 40, 6).fill("#6366f1");

        // ── Corner decorations ────────────────────────────────────
        const corners = [
            [30, 30],
            [pageWidth - 60, 30],
            [30, pageHeight - 60],
            [pageWidth - 60, pageHeight - 60],
        ];
        corners.forEach(([x, y]) => {
            doc.circle(x + 15, y + 15, 8).fill("#6366f1");
        });

        // ── EventSphere brand label ───────────────────────────────
        doc
            .fontSize(11)
            .fillColor("#6366f1")
            .font("Helvetica-Bold")
            .text("✦  EVENTSPHERE AI  ✦", 0, 52, { align: "center" });

        // ── Certificate title ─────────────────────────────────────
        doc
            .fontSize(38)
            .fillColor("#ffffff")
            .font("Helvetica-Bold")
            .text("CERTIFICATE", 0, 80, { align: "center", characterSpacing: 6 });

        doc
            .fontSize(14)
            .fillColor("#a5b4fc")
            .font("Helvetica")
            .text("OF PARTICIPATION", 0, 126, { align: "center", characterSpacing: 4 });

        // ── Divider line ──────────────────────────────────────────
        doc
            .moveTo(pageWidth / 2 - 120, 158)
            .lineTo(pageWidth / 2 + 120, 158)
            .lineWidth(1)
            .stroke("#6366f1");

        // ── "This certifies that" ─────────────────────────────────
        doc
            .fontSize(12)
            .fillColor("#94a3b8")
            .font("Helvetica")
            .text("This certificate is proudly presented to", 0, 174, { align: "center" });

        // ── Student Name ──────────────────────────────────────────
        doc
            .fontSize(36)
            .fillColor("#e0e7ff")
            .font("Helvetica-BoldOblique")
            .text(studentName, 0, 198, { align: "center" });

        // ── Name underline ────────────────────────────────────────
        const nameWidth = doc.widthOfString(studentName) * 1.05;
        doc
            .moveTo(pageWidth / 2 - nameWidth / 2, 244)
            .lineTo(pageWidth / 2 + nameWidth / 2, 244)
            .lineWidth(1.5)
            .stroke("#6366f1");

        // ── Body text ─────────────────────────────────────────────
        doc
            .fontSize(12)
            .fillColor("#94a3b8")
            .font("Helvetica")
            .text("for successfully attending and participating in", 0, 256, { align: "center" });

        // ── Event Name ────────────────────────────────────────────
        doc
            .fontSize(22)
            .fillColor("#818cf8")
            .font("Helvetica-Bold")
            .text(eventName, 0, 276, { align: "center" });

        // ── Date text ─────────────────────────────────────────────
        doc
            .fontSize(11)
            .fillColor("#94a3b8")
            .font("Helvetica")
            .text(`held on  ${eventDate}`, 0, 310, { align: "center" });

        // ── Divider ───────────────────────────────────────────────
        doc
            .moveTo(60, 348)
            .lineTo(pageWidth - 60, 348)
            .lineWidth(0.5)
            .stroke("#334155");

        // ── Signature section ─────────────────────────────────────
        const sigY = 362;
        const leftX = pageWidth / 4;
        const rightX = (pageWidth * 3) / 4;

        // Organizer signature
        doc
            .fontSize(13)
            .fillColor("#e2e8f0")
            .font("Helvetica-BoldOblique")
            .text(organizerName, leftX - 100, sigY, { width: 200, align: "center" });

        doc
            .moveTo(leftX - 80, sigY + 22)
            .lineTo(leftX + 80, sigY + 22)
            .lineWidth(0.8)
            .stroke("#475569");

        doc
            .fontSize(9)
            .fillColor("#64748b")
            .font("Helvetica")
            .text("Organizer", leftX - 100, sigY + 28, { width: 200, align: "center" });

        // EventSphere seal
        doc.circle(rightX, sigY + 14, 28).fill("#1e1b4b").stroke("#6366f1");

        doc
            .fontSize(7)
            .fillColor("#a5b4fc")
            .font("Helvetica-Bold")
            .text("EVENTSPHERE", rightX - 26, sigY + 4, { width: 52, align: "center" });

        doc
            .fontSize(6)
            .fillColor("#818cf8")
            .font("Helvetica")
            .text("VERIFIED", rightX - 26, sigY + 16, { width: 52, align: "center" });

        doc
            .fontSize(5)
            .fillColor("#6366f1")
            .text("✦ OFFICIAL ✦", rightX - 26, sigY + 26, { width: 52, align: "center" });

        // ── Footer ────────────────────────────────────────────────
        doc
            .fontSize(8)
            .fillColor("#334155")
            .font("Helvetica")
            .text(
                `Certificate ID: ${registration._id}  |  Generated on ${new Date().toLocaleDateString("en-IN")}`,
                0,
                pageHeight - 48,
                { align: "center" }
            );

        doc.end();
    } catch (error) {
        console.error("Certificate generation error:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

module.exports = { generateCertificate };