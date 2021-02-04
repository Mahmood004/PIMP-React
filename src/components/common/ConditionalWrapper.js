import React from 'react';

const ConditionalWrapper = ({ condition, wrapper, children }) => {
    return (
        <React.Fragment>
            {
                condition === "true" || condition === true ? wrapper(children) : children
            }
        </React.Fragment>
    )
}

export default ConditionalWrapper;