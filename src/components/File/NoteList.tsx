import { Box, Grid } from "@mui/material"
import NoteOutlinedIcon from "@mui/icons-material/NoteOutlined";


const NoteList = ({note, handleOpen}: {note: any, handleOpen: (note: any) => void }) => {
  return (
    <Grid key={note.etag} size={{ xs: 6, sm: 4, md: 3 }}>
                    <Box
                      className="
                        backdrop-blur-md
                        rounded-xl
                        border border-white/20
                        shadow-[0_4px_18px_rgba(0,0,0,0.25)]
                        transition-all duration-300
                        hover:bg-white/15
                        hover:shadow-[0_6px_28px_rgba(0,0,0,0.35)]
                        hover:-translate-y-1
                      "
                      onClick={() => handleOpen(note)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        padding: 2,
                        color: "black",
                        background: `linear-gradient(
                        135deg,
                        rgba(255, 193, 7, 0.5),
                        rgba(255, 152, 0, 0.5)
                      )`,
                        cursor: "pointer",
                      }}
                    >
                      {/* 🎨 NOTE ICON → tím gradient */}
                      <NoteOutlinedIcon
                        sx={{
                          fontSize: 32,
                        }}
                      />

                      <Box>
                        <strong>{note.file_name}</strong>
                        <p style={{ margin: 0 }}>Size: {note.size} B</p>
                        <p style={{ margin: 0 }}>Last Modified: {note.last_modified.slice(0, 10)}</p>
                      </Box>
                    </Box>
                  </Grid>
  )
}

export default NoteList