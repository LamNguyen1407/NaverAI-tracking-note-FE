import { useFileStore } from "@/stores/fileStore";
import { useUserStore } from "@/stores/userStore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

interface DialogUploadProps {
  open: boolean;
  onClose: () => void;
  triggerReload?: () => void;
  setIsLoading?: (value: boolean) => void;
}

const DialogUpload = ({ open, onClose }: DialogUploadProps) => {
  const [tab, setTab] = useState(0);

  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [isLoadingLink, setIsLoadingLink] = useState(false);

  //text
  const [content, setContent] = useState("");

  //link
  const [url, setUrl] = useState("");

  const triggerReload = useFileStore((state) => state.triggerReload);
  const { user_id } = useUserStore();

  const handleTabChange = (e: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // ----------- UPLOAD FILE --------------

  const handleUploadFile = async (file: File | null) => {
    if (!file) return;

    // Validate extension
    const ext = file.name.split(".").pop()?.toLowerCase();

    // Document
    const documentExtensions = ["pdf", "doc", "docx"];
    const documentMime = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    //Media
    const mediaExtensions = ["mp4", "m4a"];

    const isDocument =
      ext &&
      documentExtensions.includes(ext) &&
      documentMime.includes(file.type);
    const isMedia = ext && mediaExtensions.includes(ext);

    if (!isDocument && !isMedia) {
      toast.error("Chỉ được upload file PDF, DOC/DOCX hoặc MP4/M4A");
      return;
    }

    // Prepare form data
    const formDataMinio = new FormData();
    formDataMinio.append("file", file);

    const formDataNotebook = new FormData();
    formDataNotebook.append("file", file);
    formDataNotebook.append("type", "upload");
    formDataNotebook.append("embed", "true");
    formDataNotebook.append("delete_source", "false");
    formDataNotebook.append("async_processing", "true");

    try {
      setIsLoadingFile(true);

      let resMinio: Response | null = null;
      let resNotebook: Response | null = null;

      if (isDocument) {
        // Call both APIs
        [resMinio, resNotebook] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API}/files/upload/document?user_id=${user_id}`,
            {
              method: "POST",
              body: formDataMinio,
            }
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_NOTEBOOK}/api/sources`, {
            method: "POST",
            body: formDataNotebook,
          }),
        ]);
      } else if (isMedia) {
        // Only call Notebook API
        resNotebook = await fetch(
          `${process.env.NEXT_PUBLIC_API_NOTEBOOK}/api/sources`,
          {
            method: "POST",
            body: formDataNotebook,
          }
        );
      }

      // Parse response safely
      const minioData = await resMinio?.json().catch(() => null);
      const notebookData = await resNotebook?.json().catch(() => null);

      // Check status
      const minioSuccess = isDocument ? resMinio?.ok : true;
      const notebookSuccess = resNotebook?.ok;

      if (!minioSuccess || !notebookSuccess) {
        const errorMessage =
          (minioData?.message &&
            !minioSuccess &&
            `Minio: ${minioData.message}`) ||
          (notebookData?.message &&
            !notebookSuccess &&
            `Notebook: ${notebookData.message}`) ||
          "Upload file failed";

        throw new Error(errorMessage);
      }

      // All OK
      toast.success("Upload file successful!");
      triggerReload();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Upload file failed");
    } finally {
      setIsLoadingFile(false);
    }
  };

  // ----------- UPLOAD LINK --------------
  const handleUploadLink = async (url: string) => {
    try {
      setIsLoadingLink(true);
      const formLink = new FormData();
      formLink.append("url", url);
      formLink.append("type", "link");
      formLink.append("embed", "true");
      formLink.append("delete_source", "false");
      formLink.append("async_processing", "true");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_NOTEBOOK}/api/sources`,
        {
          method: "POST",
          body: formLink,
        }
      );
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.detail || "Upload Link failed");
        return;
      }
      const result = await res.json();
      toast.success(result.message || "Upload Link successful!");
      onClose();
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoadingLink(false);
    }
  };

  // ----------- UPLOAD TEXT --------------
  const handleUploadText = async (content: string) => {
    try {
      setIsLoadingText(true);
      const formText = new FormData();
      formText.append("content", content);
      formText.append("type", "text");
      formText.append("embed", "true");
      formText.append("delete_source", "false");
      formText.append("async_processing", "true");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_NOTEBOOK}/api/sources`,
        {
          method: "POST",
          body: formText,
        }
      );
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.detail || "Upload Text failed");
        return;
      }
      const result = await res.json();
      toast.success(result.message || "Upload Text successful!");
      onClose();
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoadingText(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Upload / Import Content</DialogTitle>

      <DialogContent>
        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Nhập Text" />
          <Tab label="Paste Link" />
          <Tab label="Upload File" />
        </Tabs>

        {/* TAB 1: Nhập Text */}
        {tab === 0 && (
          <Box>
            <TextField
              fullWidth
              multiline
              minRows={6}
              label="Content"
              variant="outlined"
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              disabled={isLoadingText}
              onClick={() => handleUploadText(content)}
              variant="contained"
              sx={{ mt: 2 }}
            >
              Confirm
            </Button>
          </Box>
        )}

        {/* TAB 2: Paste Link */}
        {tab === 1 && (
          <Box>
            <TextField
              fullWidth
              label="Paste Link"
              placeholder="https://example.com"
              variant="outlined"
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button
              disabled={isLoadingLink}
              onClick={() => handleUploadLink(url)}
              variant="contained"
              sx={{ mt: 2 }}
            >
              Confirm Link
            </Button>
          </Box>
        )}

        {/* TAB 3: Upload File */}
        {tab === 2 && (
          <Box>
            <Button
              variant="contained"
              component="label"
              disabled={isLoadingFile}
            >
              {isLoadingFile ? "Uploading..." : "Upload File"}
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx,.mp4,.m4a"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleUploadFile(file);
                }}
              />
            </Button>

            <Box sx={{ mt: 1, fontSize: 14 }}>
              Note: PDF, DOC, DOCX, MP4, M4A
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogUpload;
