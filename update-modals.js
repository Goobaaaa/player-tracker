const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, 'src', 'components', 'player-modal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Define the modal patterns to update
const modals = [
  {
    name: 'URL Input Modal',
    startPattern: /{\/\* URL Input Modal - Only for existing players \*\/\s*{player && showUrlModal && \(\s*<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black\/20">\s*<div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">\s*<div className="p-6">/s,
    endPattern: /(<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\s*}\s*\n)/s,
    replacementStart: `{/* URL Input Modal - Only for existing players */}
      {player && showUrlModal && (
        <>
          {/* Full page backdrop */}
          <div
            className="fixed inset-0 z-60 backdrop-blur-sm bg-black/20"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              minHeight: '100vh'
            }}
          />
          {/* Modal container */}
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}>
            <div className="bg-gray-800 rounded-lg w-full max-w-md m-4 shadow-2xl">
              <div className="p-6">`,
    replacementEnd: `              </div>
            </div>
          </div>
          </div>
        </>
      )}`
  },
  // Add more modal patterns here...
];

// Apply the transformations
modals.forEach(modal => {
  if (modal.startPattern.test(content)) {
    content = content.replace(modal.startPattern, modal.replacementStart);
    content = content.replace(modal.endPattern, modal.replacementEnd + '\n$1');
    console.log(`Updated ${modal.name}`);
  }
});

// Write the file back
fs.writeFileSync(filePath, content, 'utf8');
console.log('All modals updated successfully!');