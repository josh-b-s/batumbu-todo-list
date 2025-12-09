import React, {JSX} from "react";
import {FormControl, MenuItem, Select, SelectChangeEvent} from "@mui/material";

type Priority = "Low" | "Medium" | "High" | "Urgent";

interface PriorityDropdownProps {
    value?: Priority;
    onChange?: (newPriority: Priority) => void;
    className?: string;
}

/**
 * PriorityDropdown (TypeScript)
 *
 * props:
 *  - value: current priority string ("Low"|"Medium"|"High"|"Urgent")
 *  - onChange: function(newPriority: string)
 *  - className: optional classes for wrapper
 */
export default function PriorityDropdown({
                                             value = "Low",
                                             onChange = () => {
                                             },
                                             className = "",
                                         }: PriorityDropdownProps): JSX.Element {
    const handleChange = (event: SelectChangeEvent<Priority>) => {
        onChange(event.target.value as Priority);
    };

    return (
        <FormControl
            className={className}
            sx={{
                minWidth: 100,
                mr: 2,
                "& .MuiOutlinedInput-notchedOutline": {border: "none"},
                "& .MuiSelect-select": {
                    color: "white",
                    fontWeight: 700,
                    textAlign: "center",
                },
                "& .MuiSvgIcon-root": {color: "white"},
                "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    backgroundColor: "transparent",
                },
                "& .MuiOutlinedInput-root.Mui-focused": {
                    boxShadow: "none",
                },
            }}
        >
            <Select
                value={value}
                onChange={handleChange}
                size="small"
                displayEmpty
                MenuProps={{
                    PaperProps: {
                        sx: {
                            borderRadius: 3,
                            bgcolor: "white",
                            "& .MuiMenuItem-root": {
                                borderRadius: 2,
                                mx: 1,
                                my: 0.5,
                            },
                        },
                    },
                }}
                sx={{
                    borderRadius: "14px",
                }}
            >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Urgent">Urgent</MenuItem>
            </Select>
        </FormControl>
    );
}
