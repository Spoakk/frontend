"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuickAccessContext } from "../providers/QuickAccessProvider";

interface ToolWindowProps {
  tool: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  onClose: () => void;
  onUpdate: (updates: { position?: { x: number; y: number }; size?: { width: number; height: number } }) => void;
  onFocus: () => void;
}

function ToolWindow({ tool, position, size, zIndex, onClose, onUpdate, onFocus }: ToolWindowProps) {
  const [ToolComponent, setToolComponent] = useState<React.ComponentType | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [snapZone, setSnapZone] = useState<string | null>(null);
  const [savedPosition, setSavedPosition] = useState<{ position: { x: number; y: number }; size: { width: number; height: number } } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import(`@/app/tools/${tool}/page`)
      .then((mod) => setToolComponent(() => mod.default))
      .catch(() => setToolComponent(null));
  }, [tool]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-content, .window-resize')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    onFocus();
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY, width: size.width, height: size.height });
    onFocus();
  };

  const getSnapZone = (x: number, y: number): string | null => {
    const threshold = 50;
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (x < threshold && y < threshold) return 'top-left';
    if (x > w - threshold && y < threshold) return 'top-right';
    if (x < threshold && y > h - threshold) return 'bottom-left';
    if (x > w - threshold && y > h - threshold) return 'bottom-right';
    if (x < threshold) return 'left';
    if (x > w - threshold) return 'right';
    if (y < threshold) return 'top';
    if (y > h - threshold) return 'bottom';
    
    return null;
  };

  const applySnapZone = useCallback((zone: string) => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    switch (zone) {
      case 'left':
        onUpdate({ position: { x: 0, y: 0 }, size: { width: w / 2, height: h } });
        break;
      case 'right':
        onUpdate({ position: { x: w / 2, y: 0 }, size: { width: w / 2, height: h } });
        break;
      case 'top':
        onUpdate({ position: { x: 0, y: 0 }, size: { width: w, height: h / 2 } });
        break;
      case 'bottom':
        onUpdate({ position: { x: 0, y: h / 2 }, size: { width: w, height: h / 2 } });
        break;
      case 'top-left':
        onUpdate({ position: { x: 0, y: 0 }, size: { width: w / 2, height: h / 2 } });
        break;
      case 'top-right':
        onUpdate({ position: { x: w / 2, y: 0 }, size: { width: w / 2, height: h / 2 } });
        break;
      case 'bottom-left':
        onUpdate({ position: { x: 0, y: h / 2 }, size: { width: w / 2, height: h / 2 } });
        break;
      case 'bottom-right':
        onUpdate({ position: { x: w / 2, y: h / 2 }, size: { width: w / 2, height: h / 2 } });
        break;
    }
  }, [onUpdate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        const zone = getSnapZone(e.clientX, e.clientY);
        setSnapZone(zone);

        onUpdate({
          position: {
            x: Math.max(0, Math.min(window.innerWidth - size.width, newX)),
            y: Math.max(0, Math.min(window.innerHeight - 100, newY)),
          },
        });
      }
      if (isResizing) {
        const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(300, resizeStart.height + (e.clientY - resizeStart.y));
        onUpdate({
          size: { width: newWidth, height: newHeight },
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging && snapZone) {
        applySnapZone(snapZone);
      }
      setIsDragging(false);
      setIsResizing(false);
      setSnapZone(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, size, snapZone, onUpdate, applySnapZone]);

  const toggleMaximize = () => {
    if (isMaximized) {
      if (savedPosition) {
        onUpdate(savedPosition);
      }
      setIsMaximized(false);
    } else {
      setSavedPosition({ position, size });
      setIsMaximized(true);
      onUpdate({
        position: { x: 0, y: 0 },
        size: { width: window.innerWidth, height: window.innerHeight },
      });
    }
  };

  return (
    <>
      {snapZone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed pointer-events-none z-[9999] border-4 border-emerald-400 bg-emerald-500/20 rounded-lg"
          style={{
            left: snapZone.includes('right') ? `${window.innerWidth / 2}px` : '0px',
            top: snapZone.includes('bottom') ? `${window.innerHeight / 2}px` : '0px',
            width: snapZone.includes('left') || snapZone.includes('right') 
              ? `${window.innerWidth / 2}px` 
              : snapZone.includes('top') || snapZone.includes('bottom')
              ? `${window.innerWidth}px`
              : `${window.innerWidth / 2}px`,
            height: snapZone.includes('top') || snapZone.includes('bottom')
              ? `${window.innerHeight / 2}px`
              : `${window.innerHeight}px`,
          }}
        />
      )}
      
      <motion.div
        ref={windowRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed rounded-xl border border-white/10 bg-[#141417] shadow-2xl flex flex-col overflow-hidden"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          zIndex,
        }}
        onMouseDown={onFocus}
      >
      <div
        className="flex items-center justify-between px-4 py-3 bg-[#1a1a1f] border-b border-white/10 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={onClose}
              className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              title="Close"
            />
            <button
              onClick={toggleMaximize}
              className="h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
              title="Maximize"
            />
            <button
              className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
              title="Minimize"
            />
          </div>
          <span className="text-sm font-medium text-zinc-300 ml-2 capitalize">
            {tool.replace(/-/g, ' ')}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#0c0c0f] window-content">
        {ToolComponent ? (
          <div className="min-h-full">
            <ToolComponent />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-zinc-500">Loading...</div>
          </div>
        )}
      </div>

      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize window-resize"
        onMouseDown={handleResizeMouseDown}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-zinc-600" />
      </div>
    </motion.div>
    </>
  );
}

export function MultiToolModal() {
  const { toolWindows, removeToolWindow, updateToolWindow, bringToFront } = useQuickAccessContext();

  return (
    <AnimatePresence>
      {toolWindows.map((window) => (
        <ToolWindow
          key={window.id}
          tool={window.tool}
          position={window.position}
          size={window.size}
          zIndex={window.zIndex}
          onClose={() => removeToolWindow(window.id)}
          onUpdate={(updates) => updateToolWindow(window.id, updates)}
          onFocus={() => bringToFront(window.id)}
        />
      ))}
    </AnimatePresence>
  );
}
