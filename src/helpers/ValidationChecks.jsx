import _find from 'lodash/find';

export function validateEmail(email) {
    let emailError = '';  
    if (!email) {
        emailError = 'Required';
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        email
        )
    ) {
        emailError = 'Invalid email address';
    }
    return emailError;
}
export function validateRequiredFields(fieldName,fieldValue){
    let error = '';
    if(!fieldValue || fieldValue==''){
        error = ' This is a Required field. Please Enter value to proceed.'
    }
    return error;
}

export function checkPermission(menu,menuName,subMenuLink,permissions){
    let isAddAllowed = false;
    let isReadAllowed = false;
    let isEditAllowed = false;
    let permissionsAllowed = {};

    menu.map((menu) => {
        if(menu.name.toUpperCase()===menuName.toUpperCase()){
            menu.subMenu.map((subMenu)=> {
                if(subMenu.link.toUpperCase()==subMenuLink.toUpperCase()){
                    let functionalities = subMenu.functionality;
                    functionalities.map((functionality)=>{
                        permissions.map((permission)=>{
                            if(functionality.name.toUpperCase() === permission.toUpperCase()){
                                permissionsAllowed[permission] = true;
                            }
                        })                        
                    })
                }
            })
        }
    }
)
return permissionsAllowed;
}