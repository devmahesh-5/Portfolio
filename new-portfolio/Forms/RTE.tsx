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
        render={({field:{onChange}})=>(
            <Editor
            apiKey={process.env.TINYMCE_API_KEY}
            initialValue={defaultValue}
            init={{
                initialValue: defaultValue,
                height: 500,
                menubar: true,
                // Add LTR direction to fix text input issue
                directionality: 'ltr', // This fixes the RTL issue
                plugins: [
                    "image",
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "anchor",
                ],
                toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; text-align: left; }",
            }}
    
            onEditorChange={onChange}
             />
        )}
        />
        </div>
    )
}