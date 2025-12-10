import React from "react";
import {Icon, Menu, MenuItem} from "@mui/material";
import {useAccount} from "../contexts/AccountContext.tsx";
import AccountIcon from "@mui/icons-material/AccountCircle";

export default function AccountDropdown({className = ""}: { className?: string }) {
    const {logout} = useAccount();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };
    const handleClose = (e?: React.SyntheticEvent) => {
        e?.stopPropagation();
        setAnchorEl(null);
    };

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <Icon
                onClick={handleOpen}
                className={className}
                aria-label="account"
                sx={{bgcolor: "transparent", color: "white", width: 48, height: 48}}
            >
                <AccountIcon sx={{fontSize: 50}}/>
            </Icon>

            <Menu
                anchorEl={anchorEl}
                open={open}
                //@ts-ignore
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        bgcolor: "white",
                        "& .MuiMenuItem-root": {
                            borderRadius: 2,
                            mx: 1,
                            my: 0.5,
                        },
                    },
                }}
                onClick={(e) => e.stopPropagation()} // prevent parent clicks
            >
                <MenuItem onClick={() => {
                    logout();
                    handleClose();
                }}>Logout</MenuItem>
            </Menu>
        </>
    );
}
