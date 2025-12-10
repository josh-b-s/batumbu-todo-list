import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from "./App.tsx";
import {GlobalStyles, StyledEngineProvider} from "@mui/material";
import {AccountProvider} from "./contexts/AccountContext.tsx";
import {ActivityProvider} from "./contexts/ActivityContext.tsx";
import {ActivityFilterProvider} from "./contexts/ActivityFilterContext.tsx";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ActivityFilterProvider>
            <AccountProvider>
                <ActivityProvider>
                    <StyledEngineProvider enableCssLayer>
                        <GlobalStyles styles="@layer theme, base, mui, components, utilities;"/>
                        <App/>
                    </StyledEngineProvider>
                </ActivityProvider>
            </AccountProvider>
        </ActivityFilterProvider>
    </StrictMode>
)
