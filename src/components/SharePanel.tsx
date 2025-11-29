import { Share2, Copy, Link as LinkIcon, X, Check } from 'lucide-react';
import { useState } from 'react';
import { generateShareableLink } from '../utils/emailHash';

interface SharePanelProps {
  email: string;
  onClose: () => void;
}

export const SharePanel = ({ email, onClose }: SharePanelProps) => {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const shareableLink = generateShareableLink(email);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };


  return (
    <div className="bg-black border-2 border-green-500 rounded-lg p-4 sm:p-6 shadow-2xl shadow-green-500/50 max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-green-400 font-mono text-base sm:text-lg flex items-center gap-2">
          <Share2 size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Share Email Address</span>
          <span className="sm:hidden">Share</span>
        </h3>
        <button
          onClick={onClose}
          className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500 rounded text-red-400 transition-all duration-300"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="bg-green-950/30 border border-green-700 rounded p-3 sm:p-4">
          <p className="text-green-500/70 text-xs font-mono mb-2">Email Address:</p>
          <p className="text-green-300 font-mono text-xs sm:text-sm break-all mb-3">{email}</p>
          <button
            onClick={copyEmail}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 font-mono text-xs sm:text-sm"
          >
            {copied ? (
              <>
                <Check size={16} className="sm:w-[18px] sm:h-[18px]" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} className="sm:w-[18px] sm:h-[18px]" />
                Copy Email
              </>
            )}
          </button>
        </div>

        <div className="bg-green-950/30 border border-green-700 rounded p-3 sm:p-4">
          <p className="text-green-500/70 text-xs font-mono mb-2">Inbox Access Link:</p>
          <p className="text-green-300 font-mono text-xs break-all mb-3 opacity-75">{shareableLink}</p>
          <button
            onClick={copyLink}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-900/30 hover:bg-green-900/50 border border-green-500 rounded text-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 font-mono text-xs sm:text-sm"
          >
            {copiedLink ? (
              <>
                <Check size={16} className="sm:w-[18px] sm:h-[18px]" />
                Link Copied!
              </>
            ) : (
              <>
                <LinkIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                Copy Access Link
              </>
            )}
          </button>
        </div>

        <div className="bg-green-950/30 border border-green-700 rounded p-2 sm:p-3 mt-4">
          <p className="text-green-500/70 text-xs font-mono text-center px-2">
            Share this link to let others access the inbox for this email address
          </p>
        </div>
      </div>
    </div>
  );
};

