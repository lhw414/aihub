import { X, Download } from "lucide-react";

interface PdfViewerProps {
  pdfUrl: string;
  title?: string;
  onClose?: () => void;
}

export default function PdfViewer({ pdfUrl, title, onClose }: PdfViewerProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = title || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold">{title || "PDF 뷰어"}</h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-700 rounded-lg transition flex items-center gap-2"
            title="다운로드"
          >
            <Download className="w-5 h-5" />
            <span className="text-sm">다운로드</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-gray-950">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none"
          title={title || "PDF Viewer"}
        />
      </div>
    </div>
  );
}

