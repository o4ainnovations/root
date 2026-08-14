"use client";

import { useState, useEffect, useRef } from "react";

/* eslint-disable @next/next/no-img-element -- Sanity CDN images have dynamic URLs and unknown dimensions.
   Using next/image would require remotePatterns + known width/height. Raw <img> is acceptable for admin media gallery. */
import { sanityClient } from "@/lib/sanity";
import { uploadAsset, deleteAsset } from "@/lib/actions/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  ImageIcon,
  Upload,
  Copy,
  Trash2,
  FileText,
  Video,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ImageAsset = {
  _id: string;
  originalFilename: string;
  url: string;
  size: number;
  metadata?: {
    dimensions?: {
      width: number;
      height: number;
    };
  };
};

type FileAsset = {
  _id: string;
  originalFilename: string;
  url: string;
  size: number;
  mimeType: string;
  _createdAt: string;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("video/"))
    return <Video className="h-4 w-4" />;
  if (mimeType.startsWith("image/"))
    return <ImageIcon className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
}

export default function AdminMediaPage() {
  const [tab, setTab] = useState<"images" | "files">("images");
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [fileAssets, setFileAssets] = useState<FileAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fetchKey, setFetchKey] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const imageQuery = `*[_type == "sanity.imageAsset"] | order(_createdAt desc) {
        _id,
        originalFilename,
        url,
        size,
        metadata { dimensions }
      }`;
      const fileQuery = `*[_type == "sanity.fileAsset"] | order(_createdAt desc) {
        _id,
        originalFilename,
        url,
        size,
        mimeType,
        _createdAt
      }`;
      const [imageData, fileData] = await Promise.all([
        sanityClient.fetch<ImageAsset[]>(imageQuery),
        sanityClient.fetch<FileAsset[]>(fileQuery),
      ]);
      setImages(imageData);
      setFileAssets(fileData);
    } catch {
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => setFetchKey((k) => k + 1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchKey]);

  async function doUpload(file: File) {
    setUploading(true);
    try {
      await uploadAsset(file, file.name);
      toast.success("Asset uploaded successfully");
      refresh();
    } catch {
      toast.error("Failed to upload asset");
    } finally {
      setUploading(false);
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    doUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) doUpload(file);
  };

  const handleCopyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success("Copied!");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      await deleteAsset(id);
      toast.success("Asset deleted");
      refresh();
    } catch {
      toast.error("Failed to delete asset");
    }
  };

  const isEmpty = tab === "images" ? images.length === 0 : fileAssets.length === 0;

  const showImageGrid = tab === "images" && images.length > 0;
  const showFileTable = tab === "files" && fileAssets.length > 0;

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="font-heading text-3xl font-bold text-ink">Media</h1>
        <p className="font-serif text-muted-foreground mt-2">
          Manage your media library. Upload and organize images and files.
        </p>
      </div>

      <div
        className={cn(
          "border border-dashed border-border p-10 text-center transition-colors cursor-pointer",
          dragging && "bg-paper-highlight border-ink",
          uploading && "pointer-events-none opacity-50",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
      >
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-ink animate-spin" />
            <p className="label-uppercase">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="font-serif text-muted-foreground">
              Drag and drop files here, or click to select
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTab("images")}
          className={cn(
            "label-uppercase px-3 py-1 border border-border transition-colors flex items-center gap-1.5",
            tab === "images" && "bg-ink text-background",
          )}
        >
          <ImageIcon className="h-3 w-3" />
          Images
        </button>
        <button
          onClick={() => setTab("files")}
          className={cn(
            "label-uppercase px-3 py-1 border border-border transition-colors flex items-center gap-1.5",
            tab === "files" && "bg-ink text-background",
          )}
        >
          <FileText className="h-3 w-3" />
          Files
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
        </div>
      )}

      {!loading && isEmpty && (
        <p className="text-muted-foreground font-serif italic py-8 text-center">
          No assets uploaded yet. Drag and drop files to upload.
        </p>
      )}

      {!loading && showImageGrid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img._id} className="card-depth-1 flex flex-col">
              <div className="aspect-square bg-paper-shadow overflow-hidden flex items-center justify-center">
                <img
                  src={`${img.url}?w=300`}
                  alt={img.originalFilename || "Image"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-3 space-y-2">
                <p
                  className="label-uppercase truncate"
                  title={img.originalFilename}
                >
                  {img.originalFilename || "Untitled"}
                </p>
                {img.metadata?.dimensions && (
                  <p className="text-xs text-muted-foreground font-sans">
                    {img.metadata.dimensions.width} &times;{" "}
                    {img.metadata.dimensions.height}
                  </p>
                )}
                <p className="text-xs text-muted-foreground font-sans">
                  {formatFileSize(img.size)}
                </p>
                <div className="flex items-center gap-1 pt-1">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(img.url);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                    Copy URL
                  </Button>
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img._id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && showFileTable && (
        <Card className="card-depth-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fileAssets.map((file) => (
                <TableRow key={file._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.mimeType)}
                      <span
                        className="font-sans text-sm truncate max-w-[200px]"
                        title={file.originalFilename}
                      >
                        {file.originalFilename || "Untitled"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="rounded-none font-sans uppercase text-[0.625rem] tracking-wider border-border text-muted-foreground"
                    >
                      {file.mimeType?.split("/")[1] || file.mimeType || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(file._createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleCopyUrl(file.url)}
                      >
                        <Copy className="h-3 w-3" />
                        Copy URL
                      </Button>
                      <Button
                        variant="destructive"
                        size="xs"
                        onClick={() => handleDelete(file._id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
