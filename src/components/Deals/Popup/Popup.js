import React, { Component } from 'react';
import { Modal, Row, Col, Input, Tag, Button } from 'antd';
import moment from 'moment';
import withDeal from '../../../hoc/withDeal';
import commaNumber from 'comma-number';
import './Popup.css';

const { TextArea } = Input;

class Popup extends Component {

    state = {
        visible: false
    }

    componentDidMount() {
        this.setState({
            visible: true
        });
    }

    closePopup = () => {

        this.setState({
            visible: false
        });
        
        this.props.showPopup(false);
    }

    

    render() {

        const { 
            company_name,
            sponsor_name,
            location,
            deal_instrument,
            projected_irr,
            projected_multiple,
            short_description, 
            deal_circles, 
            deal_category, 
            deal_sub_category, 
            investment_amount_sought, 
            minimum_investment, 
            expected_close_date, 
            summary,
            deal_documents
        } = this.props.deal;

        return (
            <Modal
                title="Deal Quick View"
                onOk={this.closePopup}
                onCancel={this.closePopup}
                visible={this.state.visible}
                width={900}
            >
                <Row>
                    <Col span={6}>
                        <h3>In My Circles</h3>
                    </Col>
                    <Col span={18}>
                        { deal_circles.map(({circle}) => (
                            <Tag 
                                key={circle.circle_id}
                            >
                                {circle.name}
                            </Tag>
                        ))}
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <h3>Type</h3>
                    </Col>
                    <Col span={8}>
                        <h3>Category</h3>
                    </Col>
                    <Col span={8}>
                        <h3>Sub Category</h3>
                    </Col>
                </Row>

                <Row
                    gutter={8}
                >
                    <Col span={8}>
                        <Input 
                            defaultValue={deal_category && deal_category.deal_type ? deal_category.deal_type.description : 'N/A'} 
                            disabled={true} 
                        />
                    </Col>
                    <Col span={8}>
                        <Input 
                            defaultValue={deal_category ? deal_category.description : 'N/A'} 
                            disabled={true} 
                        />
                    </Col>
                    <Col span={8}>
                        <Input 
                            defaultValue={deal_sub_category ? deal_sub_category.description : 'N/A' } 
                            disabled={true} 
                        />
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <h3>Company name</h3>
                    </Col>
                    <Col span={8}>
                        <h3>Sponsor Name</h3>
                    </Col>
                    <Col span={8}>
                        <h3>Location</h3>
                    </Col>
                </Row>

                <Row
                    gutter={8}
                >
                    <Col span={8}>
                        <Input 
                            defaultValue={company_name ? company_name : 'N/A'} 
                            disabled={true} 
                        />
                    </Col>
                    <Col span={8}>
                        <Input 
                            defaultValue={sponsor_name ? sponsor_name : 'N/A'} 
                            disabled={true} 
                        />
                    </Col>
                    <Col span={8}>
                        <Input 
                            defaultValue={location ? location : 'N/A'} 
                            disabled={true} 
                        />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h3>Short Deal Description</h3>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Input 
                            defaultValue={short_description ? short_description : 'N/A'} 
                            disabled={true} 
                        />
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <h3>Projected IRR</h3>
                    </Col>
                    <Col span={8}>
                        <h3>Projected Multiple</h3>
                    </Col>
                    <Col span={8}>
                        <h3>Deal Instrument</h3>
                    </Col>
                </Row>

                <Row
                    gutter={8}
                >
                    <Col span={8}>
                        <Input 
                            defaultValue={projected_irr ? projected_irr : 'N/A'} 
                            disabled={true} 
                        />
                    </Col>
                    <Col span={8}>
                        <Input 
                            defaultValue={projected_multiple ? projected_multiple : 'N/A'} 
                            disabled={true} 
                        />
                    </Col>
                    <Col span={8}>
                        <Input 
                            defaultValue={deal_instrument ? deal_instrument.name : 'N/A'} 
                            disabled={true} 
                        />
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <h3>Amount Seeking</h3>
                    </Col>
                    <Col span={8}>
                        <h3>Minimum</h3>
                    </Col>
                    <Col span={8}>
                        <h3>Expected Close Date</h3>
                    </Col>
                </Row>

                <Row
                    gutter={8}
                >
                    <Col span={8}>
                        <Input 
                            defaultValue={investment_amount_sought ? commaNumber(investment_amount_sought) : 'N/A'} 
                            disabled={true} 
                        />
                    </Col>
                    <Col span={8}>
                        <Input 
                            defaultValue={minimum_investment ? commaNumber(minimum_investment) : 'N/A'} 
                            disabled={true} 
                        />
                    </Col>
                    <Col span={8}>
                        <Input 
                            defaultValue={expected_close_date ? moment(expected_close_date).format('MMMM Do, YYYY') : 'N/A'} 
                            disabled={true} 
                        />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h3>Executive Summary</h3>
                    </Col>
                </Row>
                <Row>
                    <TextArea 
                        autoSize={{minRows: 3, maxRows: 6}} 
                        defaultValue={summary ? summary : 'N/A'} 
                        disabled={true} 
                    />
                </Row>
                <Row>
                    <Col>
                        <h3>Documents ({deal_documents.length})</h3>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <h4>File name</h4>
                    </Col>
                    <Col span={8}>
                        <h4>Description</h4>
                    </Col>
                    <Col span={8}>
                        <h4>Download</h4>
                    </Col>
                </Row>

                { deal_documents.map(({ deal_document_id, file_name, file_type, short_description }) => (
                    <Row 
                        key={deal_document_id}
                        gutter={8}
                    >
                        <Col span={8}>{file_name}</Col>
                        <Col span={8}>
                            <Input 
                                disabled={true} 
                                defaultValue={short_description ? short_description : 'N/A'} 
                            />
                        </Col>
                        <Col span={8}>
                            <Button
                                type="link" 
                                onClick={e => this.props.download(e, {
                                    id: deal_document_id,
                                    name: file_name,
                                    type: file_type
                                })}
                            >
                                Download
                            </Button>
                        </Col>
                    </Row>
                ))}
    
            </Modal>
        )
    }
    
}

export default withDeal(Popup);