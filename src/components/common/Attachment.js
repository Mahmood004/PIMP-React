import React from 'react';
import { Upload, Icon } from 'antd';

const { Dragger } = Upload;

const Attachment = ({ fileProps }) => {

    return (
        <Dragger {...fileProps}>
            <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">
                Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                band files
            </p>
        </Dragger>
    )
}

export default Attachment;