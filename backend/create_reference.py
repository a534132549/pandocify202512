from docx import Document
from docx.shared import Pt, RGBColor
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

def create_reference_doc():
    doc = Document()
    
    # --- Define Colors ---
    # Slate-700 for body text
    color_slate_700 = (51, 65, 85)
    # Slate-800 for headings
    color_slate_800 = (30, 41, 59)
    # Indigo-600 for highlights/links (if used) or accents
    color_indigo_600 = (79, 70, 229)
    # Slate-200 for borders
    color_slate_200 = (226, 232, 240)
    # Slate-100 for secondary borders
    color_slate_100 = (241, 245, 249)

    # --- Configure Normal Style ---
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Microsoft YaHei'
    font.size = Pt(11)
    font.color.rgb = RGBColor(*color_slate_700)
    
    # Paragraph format for Normal
    p_format = style.paragraph_format
    p_format.line_spacing = 1.5
    p_format.space_after = Pt(10)
    
    # Handle East Asian font settings
    rPr = style.element.get_or_add_rPr()
    rFonts = rPr.get_or_add_rFonts()
    rFonts.set(qn('w:eastAsia'), 'Microsoft YaHei')
    
    # --- Configure Heading 1 ---
    h1 = doc.styles['Heading 1']
    h1.font.name = 'Microsoft YaHei'
    h1.font.bold = True
    h1.font.size = Pt(22)
    h1.font.color.rgb = RGBColor(*color_slate_800)
    
    h1_rPr = h1.element.get_or_add_rPr()
    h1_rFonts = h1_rPr.get_or_add_rFonts()
    h1_rFonts.set(qn('w:eastAsia'), 'Microsoft YaHei')
    
    h1_format = h1.paragraph_format
    h1_format.space_before = Pt(24)
    h1_format.space_after = Pt(12)
    
    # Add bottom border to Heading 1
    h1_pPr = h1.element.get_or_add_pPr()
    # Check if pBdr exists, otherwise create it
    h1_pBdr = h1_pPr.find(qn('w:pBdr'))
    if h1_pBdr is None:
        h1_pBdr = OxmlElement('w:pBdr')
        h1_pPr.append(h1_pBdr)
        
    h1_bottom = OxmlElement('w:bottom')
    h1_bottom.set(qn('w:val'), 'single')
    h1_bottom.set(qn('w:sz'), '6')
    h1_bottom.set(qn('w:space'), '1')
    h1_bottom.set(qn('w:color'), "E2E8F0")
    h1_pBdr.append(h1_bottom)
    
    # --- Configure Heading 2 ---
    h2 = doc.styles['Heading 2']
    h2.font.name = 'Microsoft YaHei'
    h2.font.bold = True
    h2.font.size = Pt(16)
    h2.font.color.rgb = RGBColor(*color_slate_800)

    h2_rPr = h2.element.get_or_add_rPr()
    h2_rFonts = h2_rPr.get_or_add_rFonts()
    h2_rFonts.set(qn('w:eastAsia'), 'Microsoft YaHei')
    
    h2_format = h2.paragraph_format
    h2_format.space_before = Pt(20)
    h2_format.space_after = Pt(10)

    # Add bottom border to Heading 2
    h2_pPr = h2.element.get_or_add_pPr()
    h2_pBdr = h2_pPr.find(qn('w:pBdr'))
    if h2_pBdr is None:
        h2_pBdr = OxmlElement('w:pBdr')
        h2_pPr.append(h2_pBdr)

    h2_bottom = OxmlElement('w:bottom')
    h2_bottom.set(qn('w:val'), 'single')
    h2_bottom.set(qn('w:sz'), '4')
    h2_bottom.set(qn('w:space'), '1')
    h2_bottom.set(qn('w:color'), "F1F5F9")
    h2_pBdr.append(h2_bottom)
    
    # --- Configure Heading 3 ---
    h3 = doc.styles['Heading 3']
    h3.font.name = 'Microsoft YaHei'
    h3.font.bold = True
    h3.font.size = Pt(14)
    h3.font.color.rgb = RGBColor(*color_slate_700)
    
    h3_rPr = h3.element.get_or_add_rPr()
    h3_rFonts = h3_rPr.get_or_add_rFonts()
    h3_rFonts.set(qn('w:eastAsia'), 'Microsoft YaHei')

    h3_format.space_before = Pt(16)
    h3_format.space_after = Pt(8)

    # --- Configure List Styles ---
    # Helper to create/update list styles with indentation
    def add_list_style(name, left_indent_pt, hanging_indent_pt=18):
        # python-docx doesn't easily let us create styles from scratch if they don't exist in the styles.xml
        # properly, but often 'List Bullet', 'List Bullet 2' etc are latent styles we can activate.
        # We try to get style by name.
        try:
            style = doc.styles[name]
        except KeyError:
            # If not present, we might need to add it (though adding paragraph styles specifically for lists is complex).
            # Usually standard names 'List Bullet', 'List Bullet 2' etc exist.
            # Let's try adding it as a paragraph style if missing, assuming standard behavior.
            style = doc.styles.add_style(name, 1) # 1 is PARAGRAPH
        
        style.font.name = 'Microsoft YaHei'
        style.font.size = Pt(11)
        style.font.color.rgb = RGBColor(*color_slate_700)
        
        # East Asian font
        rPr = style.element.get_or_add_rPr()
        rFonts = rPr.get_or_add_rFonts()
        rFonts.set(qn('w:eastAsia'), 'Microsoft YaHei')
        
        p_fmt = style.paragraph_format
        p_fmt.left_indent = Pt(left_indent_pt)
        p_fmt.first_line_indent = Pt(-hanging_indent_pt) # Hanging indent
        p_fmt.space_after = Pt(4) # Keep compact
        p_fmt.line_spacing = 1.5

    # Define indentations
    # Level 1: Left ~21pt + Hanging 18pt
    add_list_style('List Bullet', 24) 
    add_list_style('List Bullet 2', 48)
    add_list_style('List Bullet 3', 72)
    
    add_list_style('List Number', 24)
    add_list_style('List Number 2', 48)
    add_list_style('List Number 3', 72)

    # --- Save ---
    doc.save('reference.docx')
    print("reference.docx created successfully with Premium Web-UI styles.")

if __name__ == "__main__":
    create_reference_doc()
