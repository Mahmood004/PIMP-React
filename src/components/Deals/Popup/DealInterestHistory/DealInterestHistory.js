import React, { useState, useEffect } from 'react';
import { Modal, Table, Spin, message } from 'antd';
import { deal } from '../../../../actions';
import dealInterestHistory from '../../../../utils/columns/dealInterestHistory';
import moment from 'moment';

const { getDealInterestHistory } = deal;

const DealInterestHistory = props => {

    const { deal_id, visible, visibility } = props;

    const [interest_history, set_interest_history] = useState(null);

    useEffect(() => {

        async function fetchDealInterestHistory() {

            const history = [];

            const result = await getDealInterestHistory(deal_id);
            const { interest_history, message: msg } = result.data;

            if (result.status === 200) {

                message.success(msg);

                interest_history.forEach(record => {

                    let obj = {
                        key: record.user_deal_interest_history_id,
                        change_date: moment(record.change_date).format('MMMM Do, YYYY'),
                        from_interest: record.from_interest,
                        to_interest: record.to_interest,
                        from_interest_reason: record.from_interest_reason
                    };

                    history.push(obj);
                });

                set_interest_history(history);

            } else {
                message.error(msg);
            }
        }

        fetchDealInterestHistory();

    }, [deal_id]);

    return (
        <Modal
            title="Deal Interest History"
            visible={visible}
            onOk={e => visibility(false)}
            onCancel={e => visibility(false)}
            width={900}
        >
            { 
                !interest_history ? (
                    <Spin tip="Loading..." />
                ) : (
                    <Table dataSource={interest_history} columns={dealInterestHistory}></Table>
                )
            }
        </Modal>
    )
}

export default DealInterestHistory;