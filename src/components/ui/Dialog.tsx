import * as React from 'react';

export const Dialog = ({ children, open, onOpenChange }: { children: React.ReactNode; open: boolean; onOpenChange: (open: boolean) => void }) => {
  return (
    open ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => onOpenChange(false)}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    ) : null
  );
};

export const DialogContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export const DialogHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mb-4 border-b pb-2 ${className}`}>{children}</div>
);

export const DialogTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
);

export const DialogFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`pt-4 flex justify-end gap-2 ${className}`}>{children}</div>
);
