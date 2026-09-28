const QuestionMatrix = ({ total, answers, currentIndex }) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: total }, (_, index) => {
        const answered = answers[index] !== null && answers[index] !== undefined;
        const isCurrent = index === currentIndex;

        let classes = 'flex h-9 items-center justify-center rounded-lg text-xs font-medium';

        if (isCurrent) {
          classes += ' bg-primary-container text-on-primary-container ring-2 ring-primary';
        } else if (answered) {
          classes += ' bg-surface-container-high text-primary';
        } else {
          classes += ' bg-surface-container-lowest text-on-surface-variant';
        }

        return (
          <div key={index} className={classes}>
            Q{index + 1}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionMatrix;
