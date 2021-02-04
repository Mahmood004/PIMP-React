import React from 'react';
import { Table } from 'antd';

const Deal = props => {

    const { data, columns, pageSize, loading } = props;

    return (
        <React.Fragment>
            <Table 
                columns={columns} 
                dataSource={data} 
                pagination={{pageSize}}
                loading={loading}
                ></Table>
        </React.Fragment>
    )
}

export default Deal;