import {
  memo,
  useCallback,
  useState,
} from "react";
import "./FilePicker.less";
import Accordion from "@components/Accordion/Accordion";

type Props = {
  open: boolean;
  handleFileContentChange?: (value: string) => void;
  onFilePickerOpenChange?: () => void;
};

const FilePicker = (props: Props) => {
  const [showTypes, setShowTypes] = useState({
    remoteDraft: true,
    localDraft: true,
    published: false,
  });
  

  const handleShowTypesChange = useCallback((key: string, checked: boolean) => {
    setShowTypes((old) => ({ ...old, [key]: checked }));
  }, []);

  return (
    <div
      className={[
        "FilePicker",
        props.open ? "filepicker-show" : "filepicker-hidden",
      ].join(" ")}
    >
      <div className="filepicker-box">
        <div className="filepicker-header">
          <div className="filepicker-tab" onClick={props.onFilePickerOpenChange}>
            Articles
          </div>
          <div className="filepicker-footer">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="filepicker-remote-draft"
                checked={showTypes.remoteDraft}
                onChange={(event) =>
                  handleShowTypesChange("remoteDraft", event.target.checked)
                }
              />
              <label htmlFor="filepicker-remote-draft" className="check-button">
                在线草稿
              </label>
              <input
                type="checkbox"
                id="filepicker-published"
                checked={showTypes.published}
                onChange={(event) =>
                  handleShowTypesChange("published", event.target.checked)
                }
              />
              <label htmlFor="filepicker-published" className="check-button">
                已发布
              </label>
            </div>
          </div>
        </div>
        {}
        <div className="filepicker-draft-box">
          <Accordion>
            {showTypes.remoteDraft && (
              <Accordion.Collapse title={"在线草稿"}>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
              </Accordion.Collapse>
            )}
            {showTypes.published && (
              <Accordion.Collapse title={"已发布"}>已发布</Accordion.Collapse>
            )}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default memo(FilePicker);
