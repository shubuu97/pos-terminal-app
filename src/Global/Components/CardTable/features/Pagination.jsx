import React,{Component} from 'react';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Select from 'rc-select';
import 'rc-select/assets/index.css';


export default class PaginationComp extends Component
{
    constructor(props)
    {
        super(props);
    }
     
    render()
    {
        return(
            <div className="pagination-block">
          <Pagination
          selectComponentClass={Select}
          showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
          showQuickJumper
          showSizeChanger
          defaultPageSize={10}
          defaultCurrent={1}
          current={this.props.current}
          onShowSizeChange={this.props.onShowSizeChange}
          onChange={this.props.onChange}
          total={this.props.total}
          locale={localeInfo}
        />
            </div>
        )
    }

}