import React from "react";
import {Icon, Menu, MenuItem} from "@mui/material";
import AccountIcon from "@mui/icons-material/AccountCircle";
import {useAccount} from "../contexts/AccountContext.tsx";

export default function AccountDropdown({className = "", setShowModal}: {
    className?: string,
    setShowModal: (show: boolean) => void
}) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const {account} = useAccount()
    const open = Boolean(anchorEl);
    const openStyle = open ? "opacity-100" : "opacity-80";
    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };
    const handleClose = (e?: React.SyntheticEvent) => {
        e?.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <div className={`${className} ${openStyle} flex items-center space-x-2 font-medium text-white`}
             onClick={handleOpen}>
            <Icon
                aria-label="account"
                sx={{bgcolor: "transparent", color: "white", width: 40, height: 40}}
            >
                <AccountIcon sx={{fontSize: 40}}/>
            </Icon>
            <p className="hidden sm:block">
                {account?.name}
            </p>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={(e) => e.stopPropagation()}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 5,

                            bgcolor: "white",
                            "&:where([data-theme=Dark], [data-theme=Dark] *)": {
                                bgcolor: "#1f2937",
                                color: "white",
                            },

                            "& .MuiMenuItem-root": {
                                borderRadius: 4,
                                mx: 1,
                                my: 0.5,
                            },
                        },
                    },
                }}
            >

            <MenuItem onClick={() => {
                    setShowModal(true);
                    handleClose();
                }}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
