import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller, type Control } from 'react-hook-form';

interface RTEProps {
    name: string;
    Control: Control<any>;
    label?: string;
    defaultValue?: string;
}

export default function RTE({ name, Control, label, defaultValue = "" }: RTEProps) {

    return (
        <div className='w-full'>
            {/* {label && <label className='inline-block mb-1 pl-1'>{label}</label>} */}
            <Controller
                name={name}
                control={Control}
                defaultValue={defaultValue}
                render={({ field: { onChange, value } }) => (
                    <Editor
                        apiKey='j8950u4ltrjsw7z9bgklvg3gksdivz62xu5xwew5s0bena93'
                        value={value}
                        onEditorChange={(content) => onChange(content)}
                        init={{
                            height: 500,
                            menubar: true,
                            directionality: 'ltr',
                            plugins: `
  image media code autolink link
  lists table advlist
  anchor charmap preview
  searchreplace visualblocks fullscreen
  insertdatetime wordcount
`,
                            toolbar: `
  undo redo |
  blocks |
  bold italic underline forecolor backcolor |
  alignleft aligncenter alignright alignjustify |
  bullist numlist outdent indent |
  link image media anchor |
  table |
  charmap |
  preview fullscreen |
  code
`,

                            image_title: true,
                            automatic_uploads: true,

                            file_picker_types: 'image media',

                            file_picker_callback: (cb: (url: string, meta?: any) => void, value: string, meta: any) => {
                                // common picker for both image and video
                                const input = document.createElement('input');

                                if (meta.filetype === 'image') {
                                    input.setAttribute('type', 'file');
                                    input.setAttribute('accept', 'image/*');
                                }

                                if (meta.filetype === 'media') {
                                    input.setAttribute('type', 'file');
                                    input.setAttribute('accept', 'video/*');
                                }

                                input.addEventListener('change', (e) => {
                                    const file = (e.target as HTMLInputElement)?.files?.[0];
                                    if (!file) return;

                                    const reader = new FileReader();

                                    reader.addEventListener('load', () => {
                                        const id = 'blobid' + new Date().getTime();
                                        const blobCache = (window as any).tinymce.activeEditor.editorUpload.blobCache;

                                        const result = reader.result;
                                        let base64;

                                        if (typeof result === 'string') {
                                            base64 = result.split(',')[1];
                                        } else if (result instanceof ArrayBuffer) {
                                            const bytes = new Uint8Array(result);
                                            let binary = '';
                                            for (let i = 0; i < bytes.byteLength; i++) {
                                                binary += String.fromCharCode(bytes[i]);
                                            }
                                            base64 = btoa(binary);
                                        }

                                        const blobInfo = blobCache.create(id, file, base64);
                                        blobCache.add(blobInfo);

                                        cb(blobInfo.blobUri(), { title: file.name });
                                    });

                                    reader.readAsDataURL(file);
                                });

                                input.click();
                            },

                            content_style:
                                'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
                        }}

                    />
                )}
            />
        </div>


    )
}