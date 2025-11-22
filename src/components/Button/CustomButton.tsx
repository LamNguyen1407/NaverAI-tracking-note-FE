import { Button, CircularProgress } from "@mui/material";
import { SxProps } from "@mui/system";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  isLoading?: boolean;
  sx?: SxProps;
}

const CustomButton = ({
  children,
  onClick,
  startIcon,
  isLoading = false,
  sx = {},
}: CustomButtonProps) => {
  return (
    <Button
      onClick={onClick}
      startIcon={!isLoading ? startIcon : null}
      disabled={isLoading}
      sx={{
        width: "100%",
        padding: "12px 16px",
        marginBottom: "10px",
        backgroundColor: isLoading ? "rgba(255, 255, 255, 0.18))" : "rgba(1, 62, 106, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        borderRadius: "12px",
        color: "white",
        fontWeight: 600,
        fontSize: "14px",
        textTransform: "none",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        "&:hover": {
          backgroundColor: "rgba(67, 209, 255, 0.5)",
          border: "1px solid rgba(67, 209, 255, 0.8)",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px rgba(67, 209, 255, 0.3)",
        },
        "&:active": {
          transform: "translateY(0px)",
        },
        ...sx, // Allow override
      }}
    >
      {isLoading ? (
        <CircularProgress size={20} sx={{ color: "white" }} />
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;
