import { storageUrl } from "@services/supabase";

const mailTemplate = (body: string) => {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="en">
      <body style="font-family:Verdana, sans-serif;color:#404040;line-height:1.5;background-color:#fff">
        <div style="max-width:570px;margin:0 auto;padding:10px">
          <header style="color:#7dd1f3;margin-bottom:35px">
            <img src="${storageUrl}logo.png" alt="Fawller Speaks Logo" style="width:125px" width="125" />
          </header>
          <main>${body}</main>
        </div>
      </body>
    </html>
  `;
};

export default mailTemplate;
