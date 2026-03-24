const fs = require('fs').promises;
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater'); 

async function generateJobOrder(replaceTags, outputPath) {
  // template is located at project root `template/Job-Order.docx`
  const templatePath = path.join(__dirname, '../../template/Job-Order.docx');

  // Read template
  const content = await fs.readFile(templatePath);

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  doc.setData(replaceTags);
  try {
    doc.render();
  } catch (error) {
    const e = new Error(`Docxtemplater render error: ${error.message}`);
    e.details = error;
    throw e;
  }

  const buf = doc.getZip().generate({ type: 'nodebuffer' });

  // Ensure destination dir exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, buf);

  return outputPath;
}

module.exports = {
  generateJobOrder, 
};
