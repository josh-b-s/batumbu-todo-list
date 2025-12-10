import React, {StrictMode, useEffect, useState} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from "./App.tsx";
import {GlobalStyles, StyledEngineProvider} from "@mui/material";
import {AccountProvider} from "./contexts/AccountContext.tsx";
import {ActivityProvider} from "./contexts/ActivityContext.tsx";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AccountProvider>
            <ActivityProvider>
                <StyledEngineProvider enableCssLayer>
                    <GlobalStyles styles="@layer theme, base, mui, components, utilities;"/>
                    <App/>
                </StyledEngineProvider>
            </ActivityProvider>
        </AccountProvider>
    </StrictMode>
)
