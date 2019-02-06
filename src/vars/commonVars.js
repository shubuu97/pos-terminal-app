// Read this value from bff config

const uiLinkObj = [
    {
            key: 'basicInfo',
            addOrEditLink: '/suppliers/registration/basicinfo',
            viewLink: '/suppliers/basicinfo/details',
            enabled: false,
            displayText: 'Basic Info'
    },
    {       
            key: 'organizationInfo',
            addOrEditLink: '/suppliers/registration/organization',
            viewLink: '/suppliers/organization/details',
            enabled: false,
            displayText: 'Organization Info'
        
    },
    {
            key: 'siteInfo',
            addOrEditLink: '/suppliers/registration/sites',
            viewLink: '/suppliers/sites/details',
            enabled: false,
            displayText: 'Site Info'
    },
    {
            key: 'taxInfo',
            addOrEditLink: '/suppliers/registration/taxinfo',
            viewLink: '/suppliers/taxinfo/details',
            enabled: false,
            displayText: 'Tax Info'
    },
    {
            key: 'classificationInfo',
            addOrEditLink: '/suppliers/registration/businessclassifications',
            viewLink: '/suppliers/classificationinfo/details',
            enabled: false,
            displayText: 'Classification Info'
    },
    {
            key: 'bankingInfo',
            addOrEditLink: '/suppliers/registration/bankinginfo',
            viewLink: '/suppliers/bankinginfo/details',
            enabled: false,
            displayText: 'Banking Info'
    }
];

const ADD_MODE = 'ADD_MODE';
const EDIT_MODE = 'EDIT_MODE';
const VIEW_MODE = 'VIEW_MODE';


// @TODO : to be used for page transitions from add/edit to view and vice-versa
const PAGE_MODES = Object.freeze({
        addMode: 'ADD_MODE',
        viewMode: 'VIEW_MODE',
        editMode: 'EDIT_MODE'
});

const iframeResizerOptions = {
        checkOrigin: false,
        heightCalculationMethod: 'bodyScroll',
        scrolling: true,
        inPageLinks: true
};

export {
    uiLinkObj,
    ADD_MODE,
    EDIT_MODE,
    VIEW_MODE,
    PAGE_MODES,
    iframeResizerOptions,
}