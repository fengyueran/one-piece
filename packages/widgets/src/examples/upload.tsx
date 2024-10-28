import styled from 'styled-components';
import { Upload, Button } from '../components';

const Container = styled.div``;

export const UploadExample = () => {
  return (
    <Container>
      <Upload
        multiple
        onFiles={(files) => {
          console.log('onFiles', files);
        }}
      >
        <Button>上传文件</Button>
      </Upload>
      <Upload
        directory
        onFiles={(files) => {
          console.log('onFiles', files);
        }}
      >
        <Button>上传文件夹</Button>
      </Upload>
    </Container>
  );
};
