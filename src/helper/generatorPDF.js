const fs = require("fs").promises;
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

async function generateJobOrderPdf(data) {
  const pdfDoc = await PDFDocument.create();

  // ===== A4 SIZE =====
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  // ===== LOAD IMAGES =====
  const headerImage = await pdfDoc.embedPng(
    await fs.readFile(path.join(__dirname, "../../public/assets/header.png"))
  );
  const footerImage = await pdfDoc.embedPng(
    await fs.readFile(path.join(__dirname, "../../public/assets/footer.png"))
  );

  const headerHeight = 70;
  const footerHeight = 180;

  page.drawImage(headerImage, {
    x: 0,
    y: height - headerHeight,
    width,
    height: headerHeight,
  });
  page.drawImage(footerImage, { x: 0, y: 0, width, height: footerHeight });

  // ===== FONTS =====
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // ===== JOB ORDER TITLE =====
  const titleText = `JOB ORDER`;
  const titleSize = 14;
  const titleWidth = boldFont.widthOfTextAtSize(titleText, titleSize);
  page.drawText(titleText, {
    x: width - titleWidth - 50,
    y: height - headerHeight,
    size: titleSize,
    font: boldFont,
  });

  const titleSub = `${data.job_number}`;
  const titleSubSize = 10;
  const titleSubWidth = boldFont.widthOfTextAtSize(titleSub, titleSubSize);
  page.drawText(titleSub, {
    x: width - titleSubWidth - 50,
    y: height - headerHeight - 15,
    size: titleSubSize,
    font: boldFont,
  });

  // ===== START Y =====
  let y = height - headerHeight - 25;
  const leftMargin = 50;
  const rightMargin = 50;
  const rowHeight = 20;
  const boxPadding = 5;

  // ===== HELPER: Draw section title =====
  function drawSectionTitle(title) {
    const boxHeight = 25;
    y -= 0; // small top padding
    page.drawRectangle({
      x: leftMargin,
      y: y - boxHeight + 2,
      width: width - leftMargin - rightMargin,
      height: boxHeight,
      borderColor: rgb(0.5, 0.5, 0.5),
      borderWidth: 0.5,
      color: rgb(0.9, 0.9, 0.9),
    });

    const titleSize = 12;
    const textWidth = boldFont.widthOfTextAtSize(title, titleSize);
    const textY = y - boxHeight / 2 - titleSize / 2 + 4;

    page.drawText(title, {
      x: leftMargin + (width - leftMargin - rightMargin - textWidth) / 2,
      y: textY,
      size: titleSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    y -= boxHeight;
  }

  // ===== HELPER: Draw single row box =====
  function drawBoxRow(label, value) {
    page.drawRectangle({
      x: leftMargin,
      y: y - rowHeight + 2,
      width: width - leftMargin - rightMargin,
      height: rowHeight,
      borderColor: rgb(0.5, 0.5, 0.5),
      borderWidth: 0.5,
    });

    const labelWidth = 150;
    page.drawLine({
      start: { x: leftMargin + labelWidth, y: y - rowHeight + 2 },
      end: { x: leftMargin + labelWidth, y: y + 2 },
      thickness: 0.5,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText(label, {
      x: leftMargin + boxPadding,
      y: y - 12,
      size: 10,
      font: boldFont,
    });
    page.drawText(value ?? "", {
      x: leftMargin + labelWidth + boxPadding,
      y: y - 12,
      size: 10,
      font,
      maxWidth: width - leftMargin - rightMargin - labelWidth - boxPadding * 2,
    });

    y -= rowHeight;
  }

  function drawTwoLabelTwoValueRow(
    label1,
    value1,
    label2,
    value2,
    rowHeight = 20
  ) {
    const totalWidth = width - leftMargin - rightMargin;

    // Custom widths
    const label1Width = 150;
    const value1Width = 180;
    const label2Width = 80;
    const value2Width = totalWidth - label1Width - value1Width - label2Width;

    // Draw outer box
    page.drawRectangle({
      x: leftMargin,
      y: y - rowHeight + 2,
      width: totalWidth,
      height: rowHeight,
      borderColor: rgb(0.5, 0.5, 0.5),
      borderWidth: 0.5,
    });

    // Draw vertical dividers
    const divider1 = leftMargin + label1Width;
    const divider2 = divider1 + value1Width;
    const divider3 = divider2 + label2Width;

    [divider1, divider2, divider3].forEach((xPos) => {
      page.drawLine({
        start: { x: xPos, y: y - rowHeight + 2 },
        end: { x: xPos, y: y + 2 },
        thickness: 0.5,
        color: rgb(0.5, 0.5, 0.5),
      });
    });

    // Draw text
    page.drawText(label1, {
      x: leftMargin + 5,
      y: y - 12,
      size: 10,
      font: boldFont,
    });
    page.drawText(value1 ?? "", { x: divider1 + 2, y: y - 12, size: 10, font });

    page.drawText(label2, {
      x: divider2 + 5,
      y: y - 12,
      size: 10,
      font: boldFont,
    });
    page.drawText(value2 ?? "", { x: divider3 + 2, y: y - 12, size: 10, font });

    y -= rowHeight;
  }

  function drawStatusSection(label, options) {
    const totalWidth = width - leftMargin - rightMargin;
    const leftColWidth = 150; // label column width
    const rightColWidth = totalWidth - leftColWidth;

    // Calculate total height
    const optionHeight = 18;
    const lineHeight = 12;
    const totalHeight =
      options.length * optionHeight +
      options.filter((o) => o.hasLine).length * 12 +
      4;

    // Draw outer box
    page.drawRectangle({
      x: leftMargin,
      y: y - totalHeight + 2,
      width: totalWidth,
      height: totalHeight,
      borderColor: rgb(0.5, 0.5, 0.5),
      borderWidth: 0.5,
    });

    // Draw vertical divider
    page.drawLine({
      start: { x: leftMargin + leftColWidth, y: y - totalHeight + 2 },
      end: { x: leftMargin + leftColWidth, y: y + 2 },
      thickness: 0.5,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Draw label on left
    page.drawText(label, {
      x: leftMargin + 5,
      y: y - 15,
      size: 10,
      font: boldFont,
    });

    // Draw checklist options on right
    let optionY = y - 15;
    for (const option of options) {
      page.drawText(option.text, {
        x: leftMargin + leftColWidth + 5,
        y: optionY,
        size: 10,
        font,
      });

      // Draw extra line if needed
      if (option.hasLine) {
        optionY -= lineHeight;
        page.drawLine({
          start: { x: leftMargin + leftColWidth + 5, y: optionY },
          end: { x: leftMargin + totalWidth - 5, y: optionY },
          thickness: 0.5,
          color: rgb(0.5, 0.5, 0.5),
        });
      }

      optionY -= optionHeight;
    }

    y -= totalHeight;
  }

  function drawAcknowledgment(label, signatureText, dateText) {
    const totalWidth = width - leftMargin - rightMargin + 2;
    const leftColWidth = 150; // label column width
    const rightColWidth = totalWidth - leftColWidth;
    const rowHeight = 70;

    // Draw outer rectangle
    page.drawRectangle({
      x: leftMargin,
      y: y - rowHeight + 2,
      width: totalWidth,
      height: rowHeight,
      borderColor: rgb(0.5, 0.5, 0.5),
      borderWidth: 0.5,
    });

    // Draw vertical divider
    page.drawLine({
      start: { x: leftMargin + leftColWidth, y: y - rowHeight + 2 },
      end: { x: leftMargin + leftColWidth, y: y + 2 },
      thickness: 0.5,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Left label
    page.drawText(label, {
      x: leftMargin + 5,
      y: y - 20,
      size: 10,
      font: boldFont,
    });

    // Right side
    const rightX = leftMargin + leftColWidth + 5;

    // Calculate signature width
    const signatureWidth = boldFont.widthOfTextAtSize(signatureText, 10);

    // Draw line only under "Signature Over Name"
    page.drawLine({
      start: { x: rightX, y: y - 40 },
      end: { x: rightX + signatureWidth, y: y - 40 },
      thickness: 0.5,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Draw signature text above line
    page.drawText(signatureText, {
      x: rightX,
      y: y - 55,
      size: 10,
      font,
    });

    // Draw remaining text (Date:) after signature
    page.drawText(dateText, {
      x: rightX + signatureWidth + 20,
      y: y - 55,
      size: 10,
      font,
    });

    y -= rowHeight;
  }

  // ===== SECTIONS =====
  drawSectionTitle("INFORMATION DETAILS");
  drawBoxRow("COMPANY/ INSTITUTION:", data.company);
  drawBoxRow("NAME:", data.name);
  drawBoxRow("CITY:", data.city);
  drawBoxRow("CONTACT:", data.contact_number);
  drawBoxRow("EMAIL:", data.email);

  drawSectionTitle("DEVICE DETAILS");
  drawBoxRow("DEVICE TYPE:", data.device_type);
  drawBoxRow("DEVICE MODEL:", data.device_model);
  drawBoxRow("SERIAL NUMBER:", data.serial_number);

  drawSectionTitle("ISSUE REPORT");
  const issueDescHeight = 30;
  const issueBoxHeight = 100;

  // Description box
  page.drawRectangle({
    x: leftMargin,
    y: y - issueDescHeight + 2,
    width: width - leftMargin - rightMargin,
    height: issueDescHeight,
    borderColor: rgb(0.5, 0.5, 0.5),
    borderWidth: 0.5,
  });
  page.drawText(
    "Please describe the issue you are experiencing with the device:",
    {
      x: leftMargin + boxPadding,
      y: y - 15,
      size: 10,
      font: boldFont,
    }
  );
  y -= issueDescHeight;

  // Issue box
  page.drawRectangle({
    x: leftMargin,
    y: y - issueBoxHeight + 2,
    width: width - leftMargin - rightMargin,
    height: issueBoxHeight,
    borderColor: rgb(0.5, 0.5, 0.5),
    borderWidth: 0.5,
  });
  page.drawText(data.issue ?? "", {
    x: leftMargin + boxPadding,
    y: y - 15,
    size: 10,
    font,
    maxWidth: width - leftMargin - rightMargin - boxPadding * 2,
    lineHeight: 12,
  });
  y -= issueBoxHeight;

  // ===== SECTION: DIAGNOSTIC =====
  drawSectionTitle("DIAGNOSTIC");
  drawTwoLabelTwoValueRow(
    "TECHNICIAN NAME:",
    data.technician_name,
    "Date Checked:",
    data.date_checked
  );
  drawBoxRow("INITIAL SOLUTION:", ""); // big empty row

  // Status checkboxes
  drawStatusSection("STATUS:", [
    { text: "[ ] Repaired and in good physically condition: ", hasLine: false },
    { text: "[ ] Repaired but with deferred recommendations: ", hasLine: true },
    { text: "[ ] Unable to repair due to: ", hasLine: true },
    { text: "[ ] Pull out due to: ", hasLine: true },
    { text: "[ ] For replacement: ", hasLine: true },
  ]);

  drawAcknowledgment("ACKNOWLEDGMENT:", "Signature Over Name", "Date:");

  // ===== SAVE PDF =====
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

module.exports = { generateJobOrderPdf };
