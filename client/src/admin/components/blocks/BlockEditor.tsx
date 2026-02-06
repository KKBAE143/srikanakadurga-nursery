import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { v4 as uuid } from "uuid";
import {
  GripVertical,
  Trash2,
  Plus,
  Type,
  Heading,
  Image,
  Images,
  Youtube,
  ShoppingBag,
  ListChecks,
  Quote,
  Minus,
  MousePointerClick,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type {
  ContentBlock,
  BlockType,
  TextBlock,
  HeadingBlock,
  ImageBlock,
  GalleryBlock,
  VideoBlock,
  ProductsBlock,
  KeyPointsBlock,
  QuoteBlock,
  DividerBlock,
  CTABlock,
} from "./types";
import TextBlockEditor from "./TextBlockEditor";
import HeadingBlockEditor from "./HeadingBlockEditor";
import ImageBlockEditor from "./ImageBlockEditor";
import GalleryBlockEditor from "./GalleryBlockEditor";
import VideoBlockEditor from "./VideoBlockEditor";
import ProductsBlockEditor from "./ProductsBlockEditor";
import KeyPointsBlockEditor from "./KeyPointsBlockEditor";
import QuoteBlockEditor from "./QuoteBlockEditor";
import DividerBlockEditor from "./DividerBlockEditor";
import CTABlockEditor from "./CTABlockEditor";

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const blockTypes: Array<{
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  description: string;
}> = [
  { type: "heading", label: "Heading", icon: <Heading className="w-4 h-4" />, description: "Section heading" },
  { type: "text", label: "Text", icon: <Type className="w-4 h-4" />, description: "Rich text paragraph" },
  { type: "image", label: "Image", icon: <Image className="w-4 h-4" />, description: "Single image" },
  { type: "gallery", label: "Gallery", icon: <Images className="w-4 h-4" />, description: "Image gallery" },
  { type: "video", label: "Video", icon: <Youtube className="w-4 h-4" />, description: "YouTube video" },
  { type: "products", label: "Products", icon: <ShoppingBag className="w-4 h-4" />, description: "Featured products" },
  { type: "keypoints", label: "Key Points", icon: <ListChecks className="w-4 h-4" />, description: "Bullet highlights" },
  { type: "quote", label: "Quote", icon: <Quote className="w-4 h-4" />, description: "Highlighted quote" },
  { type: "cta", label: "Call to Action", icon: <MousePointerClick className="w-4 h-4" />, description: "CTA button" },
  { type: "divider", label: "Divider", icon: <Minus className="w-4 h-4" />, description: "Visual separator" },
];

function createNewBlock(type: BlockType): ContentBlock {
  const id = uuid();

  switch (type) {
    case "text":
      return { id, type: "text", content: "" } as TextBlock;
    case "heading":
      return { id, type: "heading", level: 2, text: "" } as HeadingBlock;
    case "image":
      return { id, type: "image", url: "", alt: "" } as ImageBlock;
    case "gallery":
      return { id, type: "gallery", images: [], columns: 2 } as GalleryBlock;
    case "video":
      return { id, type: "video", url: "" } as VideoBlock;
    case "products":
      return { id, type: "products", productIds: [] } as ProductsBlock;
    case "keypoints":
      return { id, type: "keypoints", points: [] } as KeyPointsBlock;
    case "quote":
      return { id, type: "quote", text: "" } as QuoteBlock;
    case "divider":
      return { id, type: "divider" } as DividerBlock;
    case "cta":
      return { id, type: "cta", title: "", description: "", buttonText: "Learn More", buttonLink: "/shop" } as CTABlock;
    default:
      return { id, type: "text", content: "" } as TextBlock;
  }
}

function BlockWrapper({
  block,
  index,
  total,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: {
  block: ContentBlock;
  index: number;
  total: number;
  onUpdate: (block: ContentBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const dragControls = useDragControls();

  const blockMeta = blockTypes.find((b) => b.type === block.type);

  const renderBlockEditor = () => {
    switch (block.type) {
      case "text":
        return <TextBlockEditor block={block} onChange={onUpdate} />;
      case "heading":
        return <HeadingBlockEditor block={block} onChange={onUpdate} />;
      case "image":
        return <ImageBlockEditor block={block} onChange={onUpdate} />;
      case "gallery":
        return <GalleryBlockEditor block={block} onChange={onUpdate} />;
      case "video":
        return <VideoBlockEditor block={block} onChange={onUpdate} />;
      case "products":
        return <ProductsBlockEditor block={block} onChange={onUpdate} />;
      case "keypoints":
        return <KeyPointsBlockEditor block={block} onChange={onUpdate} />;
      case "quote":
        return <QuoteBlockEditor block={block} onChange={onUpdate} />;
      case "divider":
        return <DividerBlockEditor block={block} onChange={onUpdate} />;
      case "cta":
        return <CTABlockEditor block={block} onChange={onUpdate} />;
      default:
        return <div className="p-4 text-[#8F9E8B]">Unknown block type</div>;
    }
  };

  return (
    <Reorder.Item
      value={block}
      id={block.id}
      dragListener={false}
      dragControls={dragControls}
      className="bg-[#f8faf7] border border-[#e5ebe3] rounded-xl overflow-hidden"
    >
      {/* Block Header */}
      <div className="flex items-center gap-2 p-3 bg-white border-b border-[#e5ebe3]">
        <button
          type="button"
          onPointerDown={(e) => dragControls.start(e)}
          className="p-1 cursor-grab active:cursor-grabbing text-[#8F9E8B] hover:text-[#2F4836] touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 flex-1">
          <span className="text-[#2F4836]">{blockMeta?.icon}</span>
          <span className="text-sm font-medium text-[#1A1A1A]">{blockMeta?.label}</span>
          <span className="text-xs text-[#8F9E8B]">#{index + 1}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 text-[#8F9E8B] hover:text-[#2F4836] hover:bg-[#EAEFE9] rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1.5 text-[#8F9E8B] hover:text-[#2F4836] hover:bg-[#EAEFE9] rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1.5 text-[#8F9E8B] hover:text-[#2F4836] hover:bg-[#EAEFE9] rounded"
            title="Duplicate block"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-[#8F9E8B] hover:text-red-500 hover:bg-red-50 rounded"
            title="Delete block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-[#8F9E8B] hover:text-[#2F4836] hover:bg-[#EAEFE9] rounded ml-1"
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Block Content */}
      {!collapsed && <div className="p-4">{renderBlockEditor()}</div>}
    </Reorder.Item>
  );
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  const handleReorder = (newBlocks: ContentBlock[]) => {
    onChange(newBlocks);
  };

  const addBlock = (type: BlockType, atIndex?: number) => {
    const newBlock = createNewBlock(type);
    const idx = atIndex ?? blocks.length;
    const newBlocks = [...blocks];
    newBlocks.splice(idx, 0, newBlock);
    onChange(newBlocks);
    setShowAddMenu(false);
    setInsertIndex(null);
  };

  const updateBlock = (index: number, block: ContentBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = block;
    onChange(newBlocks);
  };

  const deleteBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const duplicateBlock = (index: number) => {
    const block = blocks[index];
    const newBlock = { ...block, id: uuid() };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, removed);
    onChange(newBlocks);
  };

  return (
    <div className="space-y-4">
      {blocks.length === 0 ? (
        <div className="bg-[#f8faf7] border-2 border-dashed border-[#e5ebe3] rounded-xl p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-[#EAEFE9] rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-[#2F4836]" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
            Start Building Your Blog Post
          </h3>
          <p className="text-sm text-[#8F9E8B] mb-6">
            Add content blocks like text, images, videos, and more
          </p>
          <button
            type="button"
            onClick={() => setShowAddMenu(true)}
            className="bg-[#2F4836] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#243a2b] transition-colors"
          >
            Add First Block
          </button>
        </div>
      ) : (
        <Reorder.Group axis="y" values={blocks} onReorder={handleReorder} className="space-y-4">
          {blocks.map((block, index) => (
            <div key={block.id}>
              {/* Insert button between blocks */}
              {insertIndex === index && (
                <div className="py-2">
                  <AddBlockMenu onAdd={(type) => addBlock(type, index)} onClose={() => setInsertIndex(null)} />
                </div>
              )}
              <BlockWrapper
                block={block}
                index={index}
                total={blocks.length}
                onUpdate={(b) => updateBlock(index, b)}
                onDelete={() => deleteBlock(index)}
                onDuplicate={() => duplicateBlock(index)}
                onMoveUp={() => moveBlock(index, index - 1)}
                onMoveDown={() => moveBlock(index, index + 1)}
              />
              {/* Insert indicator */}
              <button
                type="button"
                onClick={() => setInsertIndex(insertIndex === index + 1 ? null : index + 1)}
                className="w-full py-2 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity"
              >
                <div className="flex-1 h-px bg-[#e5ebe3]" />
                <span className="text-xs text-[#8F9E8B] bg-white px-2 py-1 rounded border border-[#e5ebe3] hover:border-[#2F4836] hover:text-[#2F4836]">
                  <Plus className="w-3 h-3 inline -mt-0.5 mr-1" />
                  Insert
                </span>
                <div className="flex-1 h-px bg-[#e5ebe3]" />
              </button>
            </div>
          ))}
        </Reorder.Group>
      )}

      {/* Add block button at the end */}
      {blocks.length > 0 && (
        <button
          type="button"
          onClick={() => setShowAddMenu(true)}
          className="w-full py-4 border-2 border-dashed border-[#e5ebe3] rounded-xl text-[#8F9E8B] hover:text-[#2F4836] hover:border-[#2F4836] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Block
        </button>
      )}

      {/* Add block modal */}
      {showAddMenu && (
        <AddBlockMenu onAdd={addBlock} onClose={() => setShowAddMenu(false)} />
      )}
    </div>
  );
}

function AddBlockMenu({
  onAdd,
  onClose,
}: {
  onAdd: (type: BlockType) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#e5ebe3]">
          <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">Add Block</h3>
          <p className="text-sm text-[#8F9E8B]">Choose a content block to add</p>
        </div>
        <div className="p-4 grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
          {blockTypes.map((bt) => (
            <button
              key={bt.type}
              type="button"
              onClick={() => onAdd(bt.type)}
              className="flex items-start gap-3 p-3 rounded-lg text-left hover:bg-[#EAEFE9] transition-colors border border-transparent hover:border-[#2F4836]"
            >
              <div className="w-10 h-10 rounded-lg bg-[#f8faf7] flex items-center justify-center text-[#2F4836] flex-shrink-0">
                {bt.icon}
              </div>
              <div>
                <p className="font-medium text-sm text-[#1A1A1A]">{bt.label}</p>
                <p className="text-xs text-[#8F9E8B]">{bt.description}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-[#e5ebe3]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-sm text-[#8F9E8B] hover:text-[#1A1A1A]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
