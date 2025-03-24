import { IIntegrations } from "../../../../interfaces";

export type TDirection = "inward" | "outward" | null;
export interface IIntegrationsComponentProps {
    integrations?: IIntegrations[];
    onUpdateIntegration: (
        index: number,
        direction: TDirection,
        newEmail: string
    ) => void;
    onToggleConnection: (index: number, direction: TDirection) => void;
    onAddNewIntegrations: (payload: IIntegrations) => void;
    onDeleteIntegration: (index: number) => void;
}
export interface IInitialModalStateInterface {
    index: number;
    open: boolean;
    direction: TDirection;
    email: string;
}
export interface IInitialConfirmationPopUpInterface {
    index: number;
    open: boolean;
    direction: "inward" | "outward" | null;
    type: "connect" | "disconnect" | "updateEmail" | null;
}   