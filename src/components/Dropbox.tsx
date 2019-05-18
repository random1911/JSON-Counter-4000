import React, { FC, FormEvent, DragEvent, useState } from "react";
import Button from "./Button";
import { IError } from "./ErrorBar";
import { IJsonFile } from "./ResultView";

interface IProps {
  setError: (error: IError) => void;
  setResult: (newFile: IJsonFile) => void;
  clearErrors: () => void;
  haveErrors: boolean;
  maxFileSize?: number;
}
interface IState {
  uploading: boolean;
  isDragOver: boolean;
  maxFileSizeInMb: string;
}

interface InputFile extends FormEvent {
  target: HTMLInputElement & EventTarget;
}

const Dropbox: FC<IProps> = ({
  setError,
  setResult,
  maxFileSize = 1048576,
  haveErrors,
  clearErrors
}) => {
  const maxFileSizeInMb: string = (maxFileSize / 1024 / 1024).toFixed(0);
  const [isUploading, setUploading] = useState(false);
  const [isDragOver, setDragOver] = useState(false);

  const preventDefaults = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };
  const handleFile = (files: FileList | null) => {
    if (!files) return;
    const checkFile = (currentFile: File, index: number) => {
      const { name, size } = currentFile;
      const extensionError = `"${name}" don't have .json or .txt format.`;
      const sizeError = `"${name}" is grater than ${maxFileSizeInMb}mb`;
      const parseError = `uploaded file "${name}" can't be parsed as JSON`;
      const uploadError = `can't upload "${name}"`;

      const handleError = (text: string) => {
        const err = {
          text,
          key: `${name}_${index}`
        };
        setError(err);
      };

      /*
        * First I planned to check Mime type
        * but instead of application/json I've seen just empty string in real json
        * Whats why I check just file extension
        * .json and .txt passes as valid
        * */

      const fileNameSplitted = name.split(".");
      const fileExtension = fileNameSplitted[fileNameSplitted.length - 1];

      if (fileExtension !== "json" && fileExtension !== "txt") {
        handleError(extensionError);
        return;
      }

      if (size >= maxFileSize) {
        handleError(sizeError);
        return;
      }

      const reader = new FileReader();
      reader.onloadstart = () => {
        setUploading(true);
      };
      reader.onloadend = () => {
        setUploading(false);
        let parseResult = false;
        // check if JSON is valid
        try {
          const { result } = reader;
          if (result) {
            parseResult = JSON.parse(result.toString());
          }
        } catch (error) {
          handleError(parseError);
          return;
        }
        if (parseResult) {
          const newResult = {
            name,
            body: parseResult
          };
          setResult(newResult);
        }
      };
      reader.onerror = () => {
        handleError(uploadError);
      };

      reader.readAsText(currentFile);
    };
    Array.from(files).map(checkFile);
  };
  const handleChange = (e: InputFile) => {
    clearErrors();
    handleFile(e.target.files);
  };
  const handleDragEnter = (e: DragEvent) => {
    preventDefaults(e);
    setDragOver(true);
  };
  const handleDragOver = (e: DragEvent) => {
    preventDefaults(e);
  };
  const handleDragLeave = (e: DragEvent) => {
    preventDefaults(e);
    setDragOver(false);
  };
  const handleDrop = (e: DragEvent) => {
    preventDefaults(e);
    setDragOver(false);
    if (isUploading) return;
    clearErrors();
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFile(files);
  };

  const getModifier = () => {
    const base = " drop-box_";
    if (isDragOver && !isUploading) {
      return `${base}drag-over`;
    }
    if (haveErrors) {
      return `${base}error`;
    }
    return "";
  };

  return (
    <form
      onSubmit={onSubmit}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`drop-box${getModifier()}`}
    >
      {isUploading && <div className="drop-box__overlay">Loading...</div>}
      <input
        tabIndex={0}
        onChange={handleChange}
        type="file"
        id="file"
        multiple
        className="drop-box__input"
      />
      <Button type="label" inputId="file" text="Choose a file" />
      <p className="drop-box__description">
        File have to be JSON in .json/.txt format and less than{" "}
        {maxFileSizeInMb}mb
      </p>
    </form>
  );
};

export default Dropbox;
