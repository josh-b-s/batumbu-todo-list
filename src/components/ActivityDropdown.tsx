import React, {JSX} from "react";
import {Box, FormControl, MenuItem, Select} from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterAlt";

interface ActivityDropdownProps {
    value?: string;
    onChange?: (newValue: any) => void;
    className?: string;
    filter?: boolean;
    disabled?: boolean;
    choices: Choice[];
    hasEmptyChoice?: boolean;
    dataTheme?: string;
    fontWeight?: number;
}

export interface Choice {
    label: string;
    value: any
}

export default function ActivityDropdown({
                                             value,
                                             onChange = () => {
                                             },
                                             className = "",
                                             filter = false,
                                             disabled = false,
                                             choices,
                                             hasEmptyChoice = false,
                                             dataTheme = "",
                                             fontWeight = 400,
                                         }: ActivityDropdownProps): JSX.Element {
    // compute selected value: prefer provided `value`, otherwise choose sensible default
    const selectedValue = value !== undefined && value !== null ? value : (filter ? "All" : "-");

    const [openStyle, setOpenStyle] = React.useState<String>("");

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
        <div data-theme={dataTheme}>
            <FormControl
                className={`${className} ${openStyle}`}
                onClick={stop}
                onMouseDown={stop}
                sx={{
                    "& .MuiOutlinedInput-notchedOutline": {border: "none"},
                    "& .MuiOutlinedInput-root": {borderRadius: "14px"},

                    "& .MuiSelect-select": {
                        color: "black",
                        fontWeight: fontWeight,
                    },
                    "& .MuiSvgIcon-root": {
                        color: "black",
                    },

                    "&:where([data-theme=Dark], [data-theme=Dark] *) .MuiSelect-select": {
                        color: "white",
                    },
                    "&:where([data-theme=Dark], [data-theme=Dark] *) .MuiSvgIcon-root": {
                        color: "white",
                    },

                    "& .MuiOutlinedInput-root.Mui-disabled *": {
                        WebkitTextFillColor: "inherit",
                    },
                    "& .MuiOutlinedInput-root.Mui-disabled": {
                        opacity: 0.5,
                    },
                }}
                disabled={disabled}
            >
                <Select
                    value={selectedValue}
                    onChange={handleChange}
                    onClick={stop}
                    onMouseDown={stop}
                    displayEmpty
                    onOpen={() => setOpenStyle("opacity-100")}
                    onClose={() => setOpenStyle("opacity-80")}
                    sx={{
                        borderRadius: "14px",
                        height: "3rem",
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                borderRadius: 3,
                                bgcolor: "white",
                                color: "black",
                                "&:where([data-theme=Dark], [data-theme=Dark] *)": {
                                    bgcolor: "#1f2937",
                                    color: "white",
                                },
                                "& .MuiMenuItem-root": {
                                    borderRadius: 2,
                                    mx: 1,
                                    my: 0.5,
                                    color: "inherit",
                                },
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
                    {hasEmptyChoice ? <MenuItem value="-">-</MenuItem> : null}
                    {choices.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

