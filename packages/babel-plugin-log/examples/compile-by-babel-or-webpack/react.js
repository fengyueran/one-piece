import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';

export const OpenReportBtn = () => {
  const handleReportClick = () => {
    console.log('777777777777777');
  };
  return <div onClick={handleReportClick}>test</div>;
};

class App extends React.Component {
  render() {
    const handleClick = useCallback(function handleClick() {
      console.log('88888888888888888');
    });

    return (
      <div onClick={handleClick}>
        Hello World!
        <OpenReportBtn />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
