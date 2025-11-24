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
                defaultValue={defaultValue} // <-- set here only
                render={({ field: { onChange, value } }) => (
                    <Editor
                        apiKey='j8950u4ltrjsw7z9bgklvg3gksdivz62xu5xwew5s0bena93'
                        value={value} // controlled content
                        init={{
                            height: 500,
                            menubar: true,
                            directionality: 'ltr',
                            plugins: [
                                "image advlist autolink lists link charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
                            ],
                            toolbar:
                                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                            content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; text-align: left; }",
                        }}
                        onEditorChange={onChange}
                    />
                )}
            />

        </div>
    )
}