import React, {JSX} from "react";
import {Box, FormControl, MenuItem, Select} from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterAlt";

interface ActivityDropdownProps {
    value?: string;
    onChange?: (newPriority: string) => void;
    className?: string;
    filter?: boolean;
    disabled?: boolean;
    actions: {label: string; value: string}[];
}

export default function ActivityDropdown({
                                             value = "All",
                                             onChange = () => {
                                             },
                                             className = "",
                                             filter = false,
                                             disabled = false,
                                             actions
                                         }: ActivityDropdownProps): JSX.Element {
    const [openStyle, setOpenStyle] = React.useState<String>("")

    const handleChange = (event: any) => {
        onChange(event.target.value);
    };

    const stop = (e: React.SyntheticEvent) => {
        e.stopPropagation();
    };

    const renderIcon = () => {
        if (filter === true) {
            return <FilterIcon sx={{fontSize: 18, opacity: 0.9}}/>;
        }
        return null;
    };

    return (
        <FormControl
            className={`${className} ${openStyle}`}
            onClick={stop}
            onMouseDown={stop}
            sx={{
                "& .MuiOutlinedInput-notchedOutline": {border: "none"},
                "& .MuiSelect-select": {
                    color: "white",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                },
                "& .MuiSvgIcon-root": {color: "white"},
                "& .MuiOutlinedInput-root": {borderRadius: "14px"}
            }}
            disabled={disabled}
        >
            <Select
                value={value}
                onChange={handleChange}
                onClick={stop}
                onMouseDown={stop}
                displayEmpty
                onOpen={() => setOpenStyle("opacity-100")}
                onClose={() => setOpenStyle("opacity-80")}
                sx={{borderRadius: "14px", height: "3rem"}}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            borderRadius: 3,
                            bgcolor: "white",
                            "& .MuiMenuItem-root": {borderRadius: 2, mx: 1, my: 0.5},
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
                className={disabled ? "" : "opacity-80 hover:opacity-100"}
            >

                {filter ? <MenuItem value="All">All</MenuItem> : null}
                {actions.map((item, index) => (<MenuItem key={index} value={item.value}>{item.label}</MenuItem> ))}
            </Select>
        </FormControl>
    );
}
