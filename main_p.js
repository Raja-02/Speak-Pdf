function extractText() {
  var fileInput = document.getElementById("pdfFileInput");
  var file = fileInput.files[0];

  if (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var arrayBuffer = e.target.result;

      // Initialize pdf.js
      pdfjsLib.getDocument({ data: arrayBuffer }).then(function (pdf) {
        // Extract text from each page
        var textPromises = [];
        for (var pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          textPromises.push(
            pdf.getPage(pageNum).then(function (page) {
              return page.getTextContent();
            })
          );
        }

        // Resolve all text promises
        Promise.all(textPromises).then(function (textContents) {
          var extractedText = "";
          textContents.forEach(function (textContent) {
            extractedText += textContent.items
              .map(function (s) {
                return s.str;
              })
              .join(" ");
          });

          // Display extracted text
          document.getElementById("textOutput").innerText = extractedText;
        });
      });
    };

    reader.readAsArrayBuffer(file);
  } else {
    console.error("No file selected");
  }
}
