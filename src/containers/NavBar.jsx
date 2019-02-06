import React from 'react';
import connect from 'react-redux/lib/connect/connect';
import  Redirect  from "react-router/Redirect";
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import "bootstrap/dist/css/bootstrap.css";
import _get from 'lodash/get';
import _set from 'lodash/set';
import _map from 'lodash/map';
import { fetchUserRole } from '../../src/actions/userRoles';
import {withRouter} from 'react-router-dom';
import './../assets/stylesheets/navbar.css';
import './../assets/stylesheets/style.css';
import Link from 'react-router-dom/Link';
import logo from './../assets/images/aobLogo.png';
import usericon from './../assets/images/usericon.png';
import bellicon from './../assets/images/bell.png';
import settingicon from './../assets/images/setting.png';
import listicon from './../assets/images/list.png';
import accounticon from './../assets/images/my-profile.png';
import logouticon from './../assets/images/logout.png';
import Overlay from 'react-bootstrap/lib/Overlay';
//import findDOMNode from 'react-dom/function name(params) {
    
import findDOMNode from "react-dom/lib/findDOMNode";
const NavBar = withRouter(props => <NavBarComponent {...props}/>);

function CustomPopover({userName}) {
    return (
      <div className="profile-dropup">
        <a href="">Hey, {userName}</a>
        <a href=""><span className="iicon"><img src={accounticon} /></span> My Account</a>
        {userName && <a href=""><span className="iicon"><img src={logouticon} /></span> Logout</a>}
      </div>
    );
  }

class NavBarComponent extends React.Component {
    
    constructor(props){
        super(props);
        
        this.handleToggle = this.handleToggle.bind(this);

        this.loginCredentials = {
            email: "a@g.com",
            password: "123456"
        };
        this.state = {
            activeKey: '1',
            activeMenuIndex: 0,
            activeSubMenuIndex: 0,
            show: false,
          };
        
        this.icons = {
            'icon_inventory': 'icon-Inventory',
            'icon_supplier': 'icon-strain',
            'icon_invoices': 'icon-Invoices',
            'icon_orders': 'icon-orders',
            'icon_modules': 'icon-other-modules',
            'icon_purchase_order': 'icon-purchase-order',
            'icon_organic': 'icon-organic',
            'plant': 'icon-plant-management'
        }
        this.redirectTo = false;
        this.redirectPage = "/";
          
       
    }

    changeCurrentPath = (menuIndex, subMenuIndex) => {
        this.setState({
            activeMenuIndex: menuIndex || menuIndex === 0 ? menuIndex : this.state.activeMenuIndex,
            activeSubMenuIndex: subMenuIndex || subMenuIndex === 0 ? subMenuIndex : this.state.activeSubMenuIndex,
        });
    }

   

   
    handleSelect(activeKey) {
        this.setState({ activeKey });
      }
  

    componentDidMount() {
        // const { dispatch, userRoleReducer } = this.props;
        // dispatch(fetchUserRole(userRoleReducer,this.loginCredentials));
    }
  
    getIcon(iconName){
        
        return this.icons[iconName];
    }

    handleToggle() {
        this.setState({ show: !this.state.show });
      }

    
    render(){
        debugger;

        let moduleName=[];        

       if(this.props.status!==200){
        return (<Redirect push to="/" />)
       }
     
                const listItems = this.props.menu && this.props.menu.map((menu,menuIndex = index) => 
            (menu.subMenu && menu.subMenu.length>1) ?
            (
                <Panel key={menuIndex} eventKey={menuIndex}>
          <Panel.Heading>
        <Panel.Title toggle>{menu.displayText}<i className="fa fa-angle-down pull-right"></i></Panel.Title>
          </Panel.Heading>
          {
              (menu.subMenu.map((subMenu,subMenuIndex=index)=>
              <div onClick={() => this.changeCurrentPath(menuIndex, subMenuIndex)} key={`${menuIndex}|${subMenuIndex}`}>
              <Panel.Body style={{}} className={this.state.activeMenuIndex === menuIndex && this.state.activeSubMenuIndex === subMenuIndex  ? 'active':'inActive'} collapsible>
              
              {/* <a href={"/#"+subMenu.link}>{subMenu.displayText}</a> */}
              <Link to={subMenu.link}><span style={{fontSize:"28px",color:'#fff'}} className={this.getIcon(subMenu.icon)}></span> {subMenu.displayText} </Link>
              </Panel.Body>
              </div>
          ))
          }
          
        </Panel>
                // <MenuItems menu={menu} index={index} icons={this.icons} currentPath = {this.currentPath}/>
            ) :
            (
                <Panel key={menuIndex} eventKey={menuIndex} >
          <Panel.Heading>
              <div onClick={() => this.changeCurrentPath(menuIndex)} key={`${menuIndex}`}>
            <Panel.Title toggle className={this.state.activeMenuIndex === menuIndex ?'active':'inActive'}>
            
            {/* <a href={"/#"+menu.subMenu[0].link}>        
            {menu.subMenu[0].displayText}</a> */}
            <Link style={{ textDecoration :"none",color:'#FFF'}} to={menu.subMenu[0].link}><span style={{fontSize:"36px",color:'#FFF'}} className={this.getIcon(menu.subMenu[0].icon)}></span> {menu.subMenu[0].displayText} </Link>
            </Panel.Title>
            </div>
          </Panel.Heading>
          
          
        </Panel>
                
                // <NavItem key={menu.id} eventKey={index} href={"/#" + menu.subMenu[0].link} className={menu.subMenu[0].name}>
                //     <img className={menu.subMenu[0].icon} src={this.getIcon(menu.subMenu[0].icon)} />{menu.displayText}
                // </NavItem>
               
            )
                
           
        );
        
        return (
            
            <div className="navbar-collapse collapse ">
            <Link className="nav-link" to="/">
                <img className="logoimg" src={logo} alt="AllOnBlock Logo" />
            </Link>
         <PanelGroup accordion id="menu-bar" defaultActiveKey="0">
  {listItems}
  <Panel key={10} eventKey={10} >
          <Panel.Heading>
              <div onClick={() => this.changeCurrentPath(10)} key={10}>
            <Panel.Title toggle className={this.state.activeMenuIndex === 10 ?'active':'inActive'}>
                       
            <Link style={{ textDecoration :"none",color:'#FFF'}} to={"/lot/index"}><span style={{fontSize:"36px",color:'#FFF'}} className={this.getIcon("icon_inventory")}></span> Lot Management </Link>
            </Panel.Title>
            </div>
          </Panel.Heading>
          
          
        </Panel>
</PanelGroup>
    
{/* <div className="copyright" >Copyright &copy; 2018 All On Block Inc.</div> */}

<ul className="h-profile">
    <li><a ref={button => {
            this.target = button;
          }}
          onClick={this.handleToggle}><img src={usericon} alt="User Icon" /></a> 
          <Overlay
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
          placement="top"
          container={this}
          target={() => findDOMNode(this.target)}
        >
          <CustomPopover userName={this.props.userName} />
        </Overlay> </li>
          
    <li><a href=""><img src={bellicon} alt="User Icon" /></a> </li>
    <li><a href=""><img src={settingicon} alt="User Icon" /></a> </li>
    <li><a href=""><img src={listicon} alt="User Icon" /></a> </li>
</ul>

      </div>

  
   
    // this.props.menu ?  
    // <Navbar.Collapse>
    // <Nav>
    //     {listItems}
    //     </Nav>
    //             </Navbar.Collapse>:<div>Loading...</div>
        );
            
        
         
        
   
    }
}




const mapStateToProps = state => {
    
    let {  
        userRolesReducer, commonLoginReducer, loginReducer
        } = state

    let { menu } = userRolesReducer['userRolesData']? userRolesReducer['userRolesData'] : {};
    let { status } = userRolesReducer || '';
    let { userRoleData } = loginReducer[commonLoginReducer] || [];
    let {userName} = userRolesReducer['userRolesData']? userRolesReducer['userRolesData'] : {};
    
    return {
        menu,
        commonLoginReducer,
        status,
        userRoleData,
        userName
    }    
}

export default connect(mapStateToProps)(NavBar);