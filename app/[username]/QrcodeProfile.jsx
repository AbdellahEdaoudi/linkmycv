import React, { useContext, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { MyContext } from "../Context/MyContext";
import { QrCode, X } from "lucide-react";

function QrcodeProfile({ userDetailsG, path }) {
  const { CLIENT_URL } = useContext(MyContext);
  const qrCodeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const DownloadQRCode = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${userDetailsG.fullname}.Linkerfolio.png`;
        link.click();
      }
    }
  };

  const ShareQRCode = () => {
    if (navigator.share && qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        canvas.toBlob((blob) => {
          const file = new File(
            [blob],
            `${userDetailsG.username}.Linkerfolio.png`,
            { type: "image/png" }
          );
          navigator
            .share({
              files: [file],
              title: "QR Code",
              text: "Check out this QR Code!",
            })
            .catch((error) => console.error("Sharing failed", error));
        });
      }
    } else {
      alert("Your browser doesn't support the Web Share API.");
    }
  };

  const ShareLink = () => {
    const url = `${CLIENT_URL}${path}`;

    if (navigator.share) {
      navigator
        .share({
          url: url,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert("Share not supported on this browser");
    }
  };

  return (
    <div>
      <span 
        onClick={() => setIsOpen(true)}
        className="flex gap-2 border p-2 rounded-full w-10 cursor-pointer hover:text-red-700 hover:scale-110 duration-200"
      >
        <QrCode />
      </span>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">QR Code Profile</h2>
              
              <div className="flex flex-col justify-center items-center">
                <div className={`mb-6 hidden`} ref={qrCodeRef}>
                  <QRCodeCanvas
                    value={`${CLIENT_URL}${path}`}
                    size={500}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    renderAs="canvas"
                    includeMargin={true}
                    level="H"
                    imageSettings={{
                      src: "/LinkefolioLogo.png",
                      height: 80,
                      width: 80,
                      excavate: true,
                    }}
                  />
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-inner mb-6">
                  <QRCodeCanvas
                    id="qrcode"
                    value={`${CLIENT_URL}${path}`}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    renderAs="canvas"
                    includeMargin={true}
                    level="H"
                    imageSettings={{
                      src: "/LinkefolioLogo.png",
                      height: 50,
                      width: 50,
                      excavate: true,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-4">
                  <button
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
                    onClick={DownloadQRCode}
                  >
                    Download
                  </button>
                  <button
                    className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors duration-200"
                    onClick={ShareQRCode}
                  >
                    Share QR
                  </button>
                  <button
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors duration-200"
                    onClick={ShareLink}
                  >
                    Link
                  </button>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QrcodeProfile;
