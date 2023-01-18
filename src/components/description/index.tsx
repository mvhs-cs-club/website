type ChallengeDescriptionProps = {
  children: string;
};

const ChallengeDescription = ({ children }: ChallengeDescriptionProps) => {
  const lines = children.split('\n');
  return (
    <>
      {lines.map((line: string, index: number) => (
        <div key={`desc-line-${index}`}>
          <span>{line}</span>
          {index < lines.length - 1 && <br />}
        </div>
      ))}
    </>
  );
};

export default ChallengeDescription;
