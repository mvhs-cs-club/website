interface ImgProps {
  src: string;
  sx: object;
  alt: string;
}

const defaultProps = {
  alt: '',
  sx: {}
};

type ImgPropsType = ImgProps & typeof defaultProps;

const Img = ({ src, sx, alt }: ImgPropsType) => {
  return <img src={src} style={sx} alt={alt} referrer-policy="noreferrer" />;
};

Img.defaultProps = defaultProps;

export default Img;
