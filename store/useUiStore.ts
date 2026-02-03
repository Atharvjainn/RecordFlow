import {create} from 'zustand'


type ModalType = "Upload" | "Recorder" | null

type UiStore = {
    activeModal : ModalType,
    RecordControls : boolean,
    openRecordControls : () => void,
    closeRecordControls : () => void,
    open : (modal : ModalType) => void,
    close : () => void,
}


export const useUiStore = create<UiStore>((set,get) => ({
    activeModal : null,
    RecordControls : false,
    openRecordControls : () => {
        set({RecordControls : true})
    },
    closeRecordControls : () => {
        set({RecordControls : false})
    },
    open : (modal : ModalType) => {
        set({activeModal : modal})
    },
    close : () => {
        set({activeModal : null})
    }

}))