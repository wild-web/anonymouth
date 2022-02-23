import React from 'react';

function Message({from,data}) {
    return (
        <div clasNames="bg-gray-50 rounded-lg py-5 px-6 mb-4 text-base text-gray-500 mb-3" >
{data}
</div>
    );
}

export default Message;