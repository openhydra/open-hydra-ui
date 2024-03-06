/**
 * @AUTHOR zhy
 * @DATE 2022/2/7
 * @Description:
 */
import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
// import {Link} from 'react-router-dom';
const NotExist = () => {
  let navigate = useNavigate();

  return (
    <>
      <Result
        extra={
          <Button
            type="primary"
            onClick={() => {
              navigate('/');
            }}
          >
            Back Home
          </Button>
        }
        status="404"
        subTitle="Sorry, the page you visited does not exist."
        title="404"
      />
    </>
  );
};

export default NotExist;
