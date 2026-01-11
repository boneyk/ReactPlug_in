import TimetableContent from '../TimetableContent';
import TimetableControls from '../TimetableControls';
import TimetableToolbar from '../TimetableToolbar';

const TimetableWidget = () => {
  return (
    <div>
      <TimetableToolbar />
      <TimetableContent />
      <TimetableControls />
    </div>
  );
};

export default TimetableWidget;
