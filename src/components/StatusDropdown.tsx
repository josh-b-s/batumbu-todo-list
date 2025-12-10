import React, { JSX } from "react";
import { FormControl, MenuItem, Select, SelectChangeEvent, Box } from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterAlt";

type Status = "All" | "TODO" | "IN PROGRESS" | "DONE" | "PENDING" | "DECLINED";

interface StatusDropdownProps {
    value?: Status;
    onChange?: (newPriority: Status) => void;
    className?: string;
    filter?: boolean;
}

export default function StatusDropdown({
                                           value = "All",
                                           onChange = () => {},
                                           className = "",
                                           filter = false,
                                       }: StatusDropdownProps): JSX.Element {
    const [openStyle, setOpenStyle] = React.useState<String>("")

    const handleChange = (event: SelectChangeEvent<Status>) => {
        onChange(event.target.value as Status);
    };

    const stop = (e: React.SyntheticEvent) => {
        e.stopPropagation();
    };

    const renderIcon = () => {
        if (filter === true) {
            return <FilterIcon sx={{ fontSize: 18, opacity: 0.9 }} />;
        }
        return null;
    };

    return (
        <FormControl
            className={`${className} ${openStyle}`}
            onClick={stop}
            onMouseDown={stop}
            sx={{
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSelect-select": {
                    color: "white",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                },
                "& .MuiSvgIcon-root": { color: "white" },
                "& .MuiOutlinedInput-root": { borderRadius: "14px" }
            }}
        >
            <Select
                value={value}
                onChange={handleChange}
                onClick={stop}
                onMouseDown={stop}
                displayEmpty
                onOpen={() => setOpenStyle("opacity-100")}
                onClose={() =>setOpenStyle("opacity-80")}
                sx={{ borderRadius: "14px", height: "3rem" }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            borderRadius: 3,
                            bgcolor: "white",
                            "& .MuiMenuItem-root": { borderRadius: 2, mx: 1, my: 0.5 },
                        },
                        onMouseDown: stop,
                        onClick: stop,
                    },
                }}
                renderValue={(selected) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        {renderIcon()}
                        {selected}
                    </Box>
                )}
            >
                {filter ? <MenuItem value="All">All</MenuItem>: null }
                <MenuItem value="TODO">TODO</MenuItem>
                <MenuItem value="IN PROGRESS">IN PROGRESS</MenuItem>
                <MenuItem value="DONE">DONE</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="DECLINED">DECLINED</MenuItem>
            </Select>
        </FormControl>
    );
}
