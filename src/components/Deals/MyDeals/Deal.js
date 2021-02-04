import React from 'react';
import { Table } from 'antd';

const Deal = props => {

    const { data, columns, pageSize, loading } = props;
    
    return (
        <React.Fragment>
            <Table 
                columns={columns} 
                dataSource={data} 
                pagination={{ 
                    defaultPageSize: pageSize, 
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50']  
                }}
                loading={loading ? true : false}
            ></Table>
        </React.Fragment>
    )
}

export default Deal;