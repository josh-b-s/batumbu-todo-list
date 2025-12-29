import React from "react";
import {Icon, Menu, MenuItem} from "@mui/material";
import AccountIcon from "@mui/icons-material/AccountCircle";
import {useAccount} from "../contexts/AccountContext.tsx";
import {accounts} from "../types/account.ts";

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
                //@ts-ignore
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 3,
                            bgcolor: "white",
                            "& .MuiMenuItem-root": {
                                borderRadius: 2,
                                mx: 1,
                                my: 0.5,
                            },
                        },
                    }
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <MenuItem onClick={() => {
                    setShowModal(true);
                    handleClose();
                }}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
